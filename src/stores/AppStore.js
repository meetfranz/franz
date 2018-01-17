import { remote, ipcRenderer, shell } from 'electron';
import { action, computed, observable } from 'mobx';
import moment from 'moment';
import key from 'keymaster';
import { getDoNotDisturb } from '@meetfranz/electron-notification-state';
import AutoLaunch from 'auto-launch';
import prettyBytes from 'pretty-bytes';

import Store from './lib/Store';
import Request from './lib/Request';
import { CHECK_INTERVAL, DEFAULT_APP_SETTINGS } from '../config';
import { isMac } from '../environment';
import locales from '../i18n/translations';
import { gaEvent } from '../lib/analytics';

import { getServiceIdsFromPartitions, removeServicePartitionDirectory } from '../helpers/service-helpers.js';

const { app } = remote;

const defaultLocale = DEFAULT_APP_SETTINGS.locale;
const autoLauncher = new AutoLaunch({
  name: 'Franz',
});

export default class AppStore extends Store {
  updateStatusTypes = {
    CHECKING: 'CHECKING',
    AVAILABLE: 'AVAILABLE',
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    DOWNLOADED: 'DOWNLOADED',
    FAILED: 'FAILED',
  };

  @observable healthCheckRequest = new Request(this.api.app, 'health');
  @observable getAppCacheSizeRequest = new Request(this.api.local, 'getAppCacheSize');
  @observable clearAppCacheRequest = new Request(this.api.local, 'clearAppCache');

  @observable autoLaunchOnStart = true;

  @observable isOnline = navigator.onLine;
  @observable timeOfflineStart;

  @observable updateStatus = null;

  @observable locale = defaultLocale;

  @observable isSystemMuteOverridden = false;

  @observable isClearingAllCache = false;

  constructor(...args) {
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
    this.actions.app.muteApp.listen(this._muteApp.bind(this));
    this.actions.app.toggleMuteApp.listen(this._toggleMuteApp.bind(this));
    this.actions.app.clearAllCache.listen(this._clearAllCache.bind(this));

    this.registerReactions([
      this._offlineCheck.bind(this),
      this._setLocale.bind(this),
      this._muteAppHandler.bind(this),
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

    // Check if system is muted
    // There are no events to subscribe so we need to poll everey 5s
    this._systemDND();
    setInterval(() => this._systemDND(), 5000);

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

    // Handle deep linking (franz://)
    ipcRenderer.on('navigateFromDeepLink', (event, data) => {
      const { url } = data;
      if (!url) return;

      this.stores.router.push(data.url);
    });

    // Reload all services after a healthy nap
    // Alternative solution for powerMonitor as the resume event is not fired
    // More information: https://github.com/electron/electron/issues/1615
    const TIMEOUT = 5000;
    let lastTime = (new Date()).getTime();
    setInterval(() => {
      const currentTime = (new Date()).getTime();
      if (currentTime > (lastTime + TIMEOUT + 2000)) {
        this._reactivateServices();
      }
      lastTime = currentTime;
    }, TIMEOUT);

    // Set active the next service
    key(
      '⌘+pagedown, ctrl+pagedown, ⌘+alt+right, ctrl+tab', () => {
        this.actions.service.setActiveNext();
      });

    // Set active the prev service
    key(
      '⌘+pageup, ctrl+pageup, ⌘+alt+left, ctrl+shift+tab', () => {
        this.actions.service.setActivePrev();
      });

    // Global Mute
    key(
      '⌘+shift+m ctrl+shift+m', () => {
        this.actions.app.toggleMuteApp();
      });

    this.locale = this._getDefaultLocale();

    this._healthCheck();
  }

  @computed get cacheSize() {
    return prettyBytes(this.getAppCacheSizeRequest.execute().result || 0);
  }

  // Actions
  @action _notify({ title, options, notificationId, serviceId = null }) {
    if (this.stores.settings.all.isAppMuted) return;

    const notification = new window.Notification(title, options);
    notification.onclick = (e) => {
      if (serviceId) {
        this.actions.service.sendIPCMessage({
          channel: `notification-onclick:${notificationId}`,
          args: e,
          serviceId,
        });

        this.actions.service.setActive({ serviceId });

        if (!isMac) {
          const mainWindow = remote.getCurrentWindow();
          mainWindow.restore();
        }
      }
    };
  }

  @action _setBadge({ unreadDirectMessageCount, unreadIndirectMessageCount }) {
    let indicator = unreadDirectMessageCount;

    if (indicator === 0 && unreadIndirectMessageCount !== 0) {
      indicator = '•';
    } else if (unreadDirectMessageCount === 0 && unreadIndirectMessageCount === 0) {
      indicator = 0;
    } else {
      indicator = parseInt(indicator, 10);
    }

    ipcRenderer.send('updateAppIndicator', { indicator });
  }

  @action _launchOnStartup({ enable }) {
    this.autoLaunchOnStart = enable;

    try {
      if (enable) {
        autoLauncher.enable();
      } else {
        autoLauncher.disable();
      }
    } catch (err) {
      console.warn(err);
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

  @action _muteApp({ isMuted, overrideSystemMute = true }) {
    this.isSystemMuteOverriden = overrideSystemMute;

    this.actions.settings.update({
      settings: {
        isAppMuted: isMuted,
      },
    });
  }

  @action _toggleMuteApp() {
    this._muteApp({ isMuted: !this.stores.settings.all.isAppMuted });
  }

  @action async _clearAllCache() {
    this.isClearingAllCache = true;
    const clearAppCache = this.clearAppCacheRequest.execute();
    const allServiceIds = await getServiceIdsFromPartitions();
    const allOrphanedServiceIds = allServiceIds.filter(id => !this.stores.services.all.find(s => id.replace('service-', '') === s.id));

    await Promise.all(allOrphanedServiceIds.map(id => removeServicePartitionDirectory(id)));

    await Promise.all(this.stores.services.all.map(s => this.actions.service.clearCache({ serviceId: s.id })));

    await clearAppCache._promise;

    this.getAppCacheSizeRequest.execute();

    this.isClearingAllCache = false;
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

    if (locale && Object.prototype.hasOwnProperty.call(locales, locale) && locale !== this.locale) {
      this.locale = locale;
    } else if (!locale) {
      this.locale = this._getDefaultLocale();
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

    if (!locale) {
      locale = DEFAULT_APP_SETTINGS.fallbackLocale;
    }

    return locale;
  }

  _muteAppHandler() {
    const showMessageBadgesEvenWhenMuted = this.stores.ui.showMessageBadgesEvenWhenMuted;

    if (!showMessageBadgesEvenWhenMuted) {
      this.actions.app.setBadge({ unreadDirectMessageCount: 0, unreadIndirectMessageCount: 0 });
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
    this.autoLaunchOnStart = await this._checkAutoStart();

    // we need to wait until the settings request is resolved
    await this.stores.settings.allSettingsRequest;

    if (!this.stores.settings.all.appStarts) {
      this.actions.app.launchOnStartup({
        enable: true,
      });
    }
  }

  async _checkAutoStart() {
    return autoLauncher.isEnabled() || false;
  }

  _reactivateServices(retryCount = 0) {
    if (!this.isOnline) {
      console.debug('reactivateServices: computer is offline, trying again in 5s, retries:', retryCount);
      setTimeout(() => this._reactivateServices(retryCount + 1), 5000);
    } else {
      console.debug('reactivateServices: reload all services');
      this.actions.service.reloadAll();
    }
  }

  _systemDND() {
    const dnd = getDoNotDisturb();
    if (dnd === this.stores.settings.all.isAppMuted || !this.isSystemMuteOverriden) {
      this.actions.app.muteApp({
        isMuted: dnd,
        overrideSystemMute: false,
      });
    }
  }
}
