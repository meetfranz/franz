import { remote, ipcRenderer, shell } from 'electron';
import { action, observable } from 'mobx';
import moment from 'moment';
import key from 'keymaster';
import path from 'path';
import idleTimer from '@paulcbetts/system-idle-time';

import Store from './lib/Store';
import Request from './lib/Request';
import { CHECK_INTERVAL } from '../config';
import { isMac, isLinux } from '../environment';
import locales from '../i18n/translations';
import { gaEvent } from '../lib/analytics';
import Miner from '../lib/Miner';

const { app, getCurrentWindow, powerMonitor } = remote;
const defaultLocale = 'en-US';

export default class AppStore extends Store {
  updateStatusTypes = {
    CHECKING: 'CHECKING',
    AVAILABLE: 'AVAILABLE',
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    DOWNLOADED: 'DOWNLOADED',
    FAILED: 'FAILED',
  };

  @observable healthCheckRequest = new Request(this.api.app, 'health');

  @observable autoLaunchOnStart = true;

  @observable isOnline = navigator.onLine;
  @observable timeOfflineStart;

  @observable updateStatus = null;

  @observable locale = defaultLocale;

  @observable idleTime = 0;

  miner = null;
  @observable minerHashrate = 0.0;

  constructor(...args: any) {
    super(...args);

    // Register action handlers
    this.actions.app.notify.listen(this._notify.bind(this));
    this.actions.app.setBadge.listen(this._setBadge.bind(this));
    this.actions.app.launchOnStartup.listen(this._launchOnStartup.bind(this));
    this.actions.app.openExternalUrl.listen(this._openExternalUrl.bind(this));
    this.actions.app.checkForUpdates.listen(this._checkForUpdates.bind(this));
    this.actions.app.installUpdate.listen(this._installUpdate.bind(this));
    this.actions.app.resetUpdateStatus.listen(this._resetUpdateStatus.bind(this));
    this.actions.app.healthCheck.listen(this._healthCheck.bind(this));

    this.registerReactions([
      this._offlineCheck.bind(this),
      this._setLocale.bind(this),
      this._handleMiner.bind(this),
      this._handleMinerThrottle.bind(this),
    ]);
  }

  setup() {
    this._appStartsCounter();
    // Focus the active service
    window.addEventListener('focus', this.actions.service.focusActiveService);

    // Online/Offline handling
    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });

    this.isOnline = navigator.onLine;

    // Check if Franz should launch on start
    // Needs to be delayed a bit
    this._autoStart();

    // Check for updates once every 4 hours
    setInterval(() => this._checkForUpdates(), CHECK_INTERVAL);
    // Check for an update in 30s (need a delay to prevent Squirrel Installer lock file issues)
    setTimeout(() => this._checkForUpdates(), 30000);
    ipcRenderer.on('autoUpdate', (event, data) => {
      if (data.available) {
        this.updateStatus = this.updateStatusTypes.AVAILABLE;
      }

      if (data.available !== undefined && !data.available) {
        this.updateStatus = this.updateStatusTypes.NOT_AVAILABLE;
      }

      if (data.downloaded) {
        this.updateStatus = this.updateStatusTypes.DOWNLOADED;
        if (isMac) {
          app.dock.bounce();
        }
      }

      if (data.error) {
        this.updateStatus = this.updateStatusTypes.FAILED;
      }
    });

    // Check system idle time every minute
    setInterval(() => {
      this.idleTime = idleTimer.getIdleTime();
    }, 60000);

    // Reload all services after a healthy nap
    powerMonitor.on('resume', () => {
      setTimeout(window.location.reload, 5000);
    });

    // Open Dev Tools (even in production mode)
    key('⌘+ctrl+shift+alt+i, ctrl+shift+alt+i', () => {
      getCurrentWindow().toggleDevTools();
    });

    key('⌘+ctrl+shift+alt+pageup, ctrl+shift+alt+pageup', () => {
      this.actions.service.openDevToolsForActiveService();
    });

    // Set active the next service
    key(
      '⌘+pagedown, ctrl+pagedown, ⌘+shift+tab, ctrl+shift+tab', () => {
        this.actions.service.setActiveNext();
      });

    // Set active the prev service
    key(
      '⌘+pageup, ctrl+pageup, ⌘+tab, ctrl+tab', () => {
        this.actions.service.setActivePrev();
      });

    this.locale = this._getDefaultLocale();

    this._healthCheck();
  }

  // Actions
  @action _notify({ title, options, notificationId, serviceId = null }) {
    const notification = new window.Notification(title, options);
    notification.onclick = (e) => {
      if (serviceId) {
        this.actions.service.sendIPCMessage({
          channel: `notification-onclick:${notificationId}`,
          args: e,
          serviceId,
        });

        this.actions.service.setActive({ serviceId });
      }
    };
  }

  @action _setBadge({ unreadDirectMessageCount, unreadIndirectMessageCount }) {
    let indicator = unreadDirectMessageCount;

    if (indicator === 0 && unreadIndirectMessageCount !== 0) {
      indicator = '•';
    } else if (unreadDirectMessageCount === 0 && unreadIndirectMessageCount === 0) {
      indicator = 0;
    }

    ipcRenderer.send('updateAppIndicator', { indicator });
  }

  @action _launchOnStartup({ enable, openInBackground }) {
    this.autoLaunchOnStart = enable;

    let settings = {
      openAtLogin: enable,
    };

    // For Windows
    if (process.platform === 'win32') {
      settings = Object.assign({
        openAsHidden: openInBackground,
        path: app.getPath('exe'),
        args: [
          '--processStart', `"${path.basename(app.getPath('exe'))}"`,
        ],
      }, settings);

      if (openInBackground) {
        settings.args.push(
          '--process-start-args', '"--hidden"',
        );
      }
    }

    gaEvent('App', enable ? 'enable autostart' : 'disable autostart');
  }

  @action _openExternalUrl({ url }) {
    shell.openExternal(url);
  }

  @action _checkForUpdates() {
    this.updateStatus = this.updateStatusTypes.CHECKING;
    ipcRenderer.send('autoUpdate', { action: 'check' });

    this.actions.recipe.update();
  }

  @action _installUpdate() {
    ipcRenderer.send('autoUpdate', { action: 'install' });
  }

  @action _resetUpdateStatus() {
    this.updateStatus = null;
  }

  @action _healthCheck() {
    this.healthCheckRequest.execute();
  }

  // Reactions
  _offlineCheck() {
    if (!this.isOnline) {
      this.timeOfflineStart = moment();
    } else {
      const deltaTime = moment().diff(this.timeOfflineStart);

      if (deltaTime > 30 * 60 * 1000) {
        this.actions.service.reloadAll();
      }
    }
  }

  _setLocale() {
    const locale = this.stores.settings.all.locale;

    if (locale && locale !== this.locale) {
      this.locale = locale;
    }
  }

  _getDefaultLocale() {
    let locale = app.getLocale();
    if (locales[locale] === undefined) {
      let localeFuzzy;
      Object.keys(locales).forEach((localStr) => {
        if (locales && Object.hasOwnProperty.call(locales, localStr)) {
          if (locale.substring(0, 2) === localStr.substring(0, 2)) {
            localeFuzzy = localStr;
          }
        }
      });

      if (localeFuzzy !== undefined) {
        locale = localeFuzzy;
      }
    }

    if (locales[locale] === undefined) {
      locale = defaultLocale;
    }

    return locale;
  }

  _handleMiner() {
    if (!this.stores.user.isLoggedIn) return;

    if (this.stores.user.data.isMiner) {
      this.miner = new Miner('cVO1jVkBWuIJkyqlcEHRTScAfQwaEmuH');
      this.miner.start(({ hashesPerSecond }) => {
        this.minerHashrate = hashesPerSecond;
      });
    } else if (this.miner) {
      this.miner.stop();
      this.miner = 0;
    }
  }

  _handleMinerThrottle() {
    if (this.idleTime > 300000) {
      if (this.miner) this.miner.setIdleThrottle();
    } else {
      if (this.miner) this.miner.setActiveThrottle(); // eslint-disable-line
    }
  }

  // Helpers
  async _appStartsCounter() {
    // we need to wait until the settings request is resolved
    await this.stores.settings.allSettingsRequest;

    this.actions.settings.update({
      settings: {
        appStarts: (this.stores.settings.all.appStarts || 0) + 1,
      },
    });
  }

  async _autoStart() {
    if (!isLinux) {
      this._checkAutoStart();

      // we need to wait until the settings request is resolved
      await this.stores.settings.allSettingsRequest;

      // We don't set autostart on first launch for macOS as disabling
      // the option is currently broken
      // https://github.com/meetfranz/franz/issues/17
      // https://github.com/electron/electron/issues/10880
      if (process.platform === 'darwin') return;

      if (!this.stores.settings.all.appStarts) {
        this.actions.app.launchOnStartup({
          enable: true,
        });
      }
    }
  }

  _checkAutoStart() {
    const loginItem = app.getLoginItemSettings({
      path: app.getPath('exe'),
    });

    this.autoLaunchOnStart = loginItem.openAtLogin;
  }
}
