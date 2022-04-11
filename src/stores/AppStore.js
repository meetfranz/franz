import { ipcRenderer, shell } from 'electron';
import {
  app, screen, powerMonitor, nativeTheme, getCurrentWindow,
} from '@electron/remote';
import {
  action, computed, observable, reaction,
} from 'mobx';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import ms from 'ms';
import { URL } from 'url';
import os from 'os';
import path from 'path';
import { readJsonSync } from 'fs-extra';

import Store from './lib/Store';
import Request from './lib/Request';
import { CHECK_INTERVAL, DEFAULT_APP_SETTINGS } from '../config';
import { isMac, isWindows } from '../environment';
import locales from '../i18n/translations';
import { gaEvent, gaPage } from '../lib/analytics';
import { getLocale } from '../helpers/i18n-helpers';

import { getServiceIdsFromPartitions, removeServicePartitionDirectory } from '../helpers/service-helpers.js';
import { isValidExternalURL } from '../helpers/url-helpers';
import { sleep } from '../helpers/async-helpers';
import { UPDATE_FULL_SCREEN_STATUS } from '../electron/ipc-api/fullscreen';
import {
  CHECK_FOR_UPDATE, CHECK_MACOS_PERMISSIONS, FETCH_DEBUG_INFO, OVERLAY_SHARE_SETTINGS, RELOAD_APP, WINDOWS_TITLEBAR_FETCH_MENU, WINDOWS_TITLEBAR_INITIALIZE,
} from '../ipcChannels';

const debug = require('debug')('Franz:AppStore');

const mainWindow = getCurrentWindow();

const defaultLocale = DEFAULT_APP_SETTINGS.locale;

const CATALINA_NOTIFICATION_HACK_KEY = '_temp_askedForCatalinaNotificationPermissions';

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

  @observable timeSuspensionStart = moment();

  @observable timeOfflineStart;

  @observable updateStatus = null;

  @observable locale = defaultLocale;

  @observable isSystemMuteOverridden = false;

  @observable isSystemDarkModeEnabled = false;

  @observable isClearingAllCache = false;

  @observable isFullScreen = mainWindow.isFullScreen();

  @observable isFocused = true;

  @observable nextAppReleaseVersion = null;

  dictionaries = [];

  fetchDataInterval = null;

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
      this._handleFullScreen.bind(this),
      this._handleLogout.bind(this),
      isMac ? this._handleMacOSPermissionsCheck.bind(this) : () => {},
    ]);
  }

  async setup() {
    this._appStartsCounter();

    // Online/Offline handling
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    this.isOnline = navigator.onLine;

    // Check if Franz should launch on start
    // Needs to be delayed a bit
    this._autoStart();

    // Check if system is muted
    // There are no events to subscribe so we need to poll everey 5s
    this._systemDND();
    setInterval(() => this._systemDND(), ms('5s'));

    this.fetchDataInterval = setInterval(() => {
      this.stores.user.getUserInfoRequest.invalidate({
        immediately: true,
      });
      this.stores.features.featuresRequest.invalidate({
        immediately: true,
      });
      this.stores.news.latestNewsRequest.invalidate({
        immediately: true,
      });
    }, ms('60m'));

    // Check for updates once every 4 hours
    setInterval(() => this._checkForUpdates(), CHECK_INTERVAL);
    // Check for an update in 30s (need a delay to prevent Squirrel Installer lock file issues)
    setTimeout(() => this._checkForUpdates(), ms('30s'));
    ipcRenderer.on('autoUpdate', (event, data) => {
      if (data.available) {
        this.updateStatus = this.updateStatusTypes.AVAILABLE;
        this.nextAppReleaseVersion = data.version;
        if (isMac) {
          app.dock.bounce();
        }
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

    ipcRenderer.on(UPDATE_FULL_SCREEN_STATUS, (e, status) => {
      this.isFullScreen = status;
    });

    ipcRenderer.on(RELOAD_APP, () => {
      window.location.reload();
    });

    ipcRenderer.on(FETCH_DEBUG_INFO, (e) => {
      ipcRenderer.sendTo(e.senderId, FETCH_DEBUG_INFO, JSON.parse(JSON.stringify(this.debugInfo)));
    });

    ipcRenderer.on(CHECK_FOR_UPDATE, () => {
      this._checkForUpdates();
    });

    // Handle deep linking (franz://)
    ipcRenderer.on('navigateFromDeepLink', (event, data) => {
      debug('Navigate from deep link', data);
      let {
        url,
      } = data;
      if (!url) return;

      url = url.replace(/\/$/, '');

      this.stores.router.push(url);
    });

    this.locale = this._getDefaultLocale();

    this._healthCheck();

    this.isSystemDarkModeEnabled = nativeTheme.shouldUseDarkColors;

    ipcRenderer.on('isWindowFocused', (event, isFocused) => {
      debug('Setting is focused to', isFocused);
      this.isFocused = isFocused;
    });

    ipcRenderer.on(OVERLAY_SHARE_SETTINGS, (event) => {
      ipcRenderer.sendTo(event.senderId, OVERLAY_SHARE_SETTINGS, {
        locale: this.locale,
        theme: !this.stores.ui.isDarkThemeActive ? 'default' : 'dark',
      });
    });

    // analytics autorun
    reaction(() => this.stores.router.location.pathname, (pathname) => {
      gaPage(pathname);
    });

    powerMonitor.on('suspend', () => {
      debug('System suspended starting timer');

      this.timeSuspensionStart = moment();
    });

    powerMonitor.on('resume', () => {
      debug('System resumed, last suspended on', this.timeSuspensionStart);

      if (this.timeSuspensionStart.add(10, 'm').isBefore(moment())) {
        debug('Reloading services, user info and features');

        const reloadInterval = setInterval(() => {
          debug('Reload app interval is starting, checking for internet connection');
          if (this.isOnline) {
            debug('Clearing interval, invalidating stores');
            clearInterval(reloadInterval);

            this.stores.user.getUserInfoRequest.invalidate({ immediately: true });
            this.stores.services.allServicesRequest.invalidate({ immediately: true });
            this.stores.features.defaultFeaturesRequest.invalidate({ immediately: true });
            this.stores.features.featuresRequest.invalidate({ immediately: true });
          }
        }, ms('2s'));
      }
    });

    // macOS catalina notifications hack
    // notifications got stuck after upgrade but forcing a notification
    // via `new Notification` triggered the permission request
    if (isMac) {
      if (!localStorage.getItem(CATALINA_NOTIFICATION_HACK_KEY)) {
        debug('Triggering macOS Catalina notification permission trigger');
        // eslint-disable-next-line no-new
        new window.Notification('Welcome to Franz 5', {
          body: 'Have a wonderful day & happy messaging.',
        });

        localStorage.setItem(CATALINA_NOTIFICATION_HACK_KEY, true);
      }
    }
  }

  @computed get cacheSize() {
    return prettyBytes(this.getAppCacheSizeRequest.execute().result || 0);
  }

  @computed get debugInfo() {
    return {
      host: {
        platform: process.platform,
        release: os.release(),
        screens: screen.getAllDisplays(),
      },
      franz: {
        version: app.getVersion(),
        electron: process.versions.electron,
        installedRecipes: this.stores.recipes.all.map(recipe => ({
          id: recipe.id,
          version: recipe.version,
        })),
        devRecipes: this.stores.recipePreviews.dev.map(recipe => ({
          id: recipe.id,
          version: recipe.version,
        })),
        services: this.stores.services.all.map(service => ({
          id: service.id,
          recipe: service.recipe.id,
        })),
        workspaces: this.stores.workspaces.workspaces.map(workspace => ({
          id: workspace.id,
          services: workspace.services,
        })),
        windowSettings: readJsonSync(path.join(app.getPath('userData'), 'window-state.json')),
        user: this.stores.user.data.id,
      },
    };
  }

  @computed get menuData() {
    return {
      user: {
        isLoggedIn: this.stores.user.isLoggedIn,
        isPremium: this.stores.user.isPremium,
      },
      services: this.stores.services.allDisplayed,
      workspaces: this.stores.workspaces.workspaces,
      app: {
        isTodosEnabled: this.stores.todos.isFeatureEnabledByUser,
        isTodosDrawerOpen: this.stores.todos.isTodosPanelVisible,
        isWorkspaceFeatureEnabled: this.stores.workspaces.isFeatureEnabled,
        isWorkspaceDrawerOpen: this.stores.workspaces.isWorkspaceDrawerOpen,
      },
    };
  }

  // Actions
  @action _notify({
    title,
    options,
    notificationId,
    serviceId = null,
  }) {
    if (this.stores.settings.all.app.isAppMuted) return;

    // TODO: is there a simple way to use blobs for notifications without storing them on disk?
    if (options.icon && options.icon.startsWith('blob:')) {
      delete options.icon;
    }

    const notification = new window.Notification(title, options);

    debug('New notification', title, options);

    notification.onclick = () => {
      console.log('notification click');
      if (serviceId) {
        this.actions.service.sendIPCMessage({
          channel: `notification-onclick:${notificationId}`,
          args: {},
          serviceId,
        });

        this.actions.service.setActive({
          serviceId,
        });
        mainWindow.show();
        if (app.mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();

        debug('Notification click handler');
      }
    };
  }

  @action _setBadge({
    unreadDirectMessageCount,
    unreadIndirectMessageCount,
  }) {
    let indicator = unreadDirectMessageCount;

    if (indicator === 0 && unreadIndirectMessageCount !== 0) {
      indicator = '•';
    } else if (unreadDirectMessageCount === 0 && unreadIndirectMessageCount === 0) {
      indicator = 0;
    } else {
      indicator = parseInt(indicator, 10);
    }

    ipcRenderer.send('updateAppIndicator', {
      indicator,
    });
  }

  @action _launchOnStartup({ enable }) {
    this.autoLaunchOnStart = enable;

    try {
      const appExe = path.resolve(process.execPath);
      const exeName = path.basename(appExe);

      const args = {
        openAtLogin: enable,
      };

      if (isWindows) {
        Object.assign(args, {
          path: appExe,
          name: 'Franz',
          args: [
            '--processStart', `"${exeName}"`,
            '--process-start-args', '"--hidden"',
          ],
        });
      }

      debug('Setting login item settings to', args);

      app.setLoginItemSettings(args);
    } catch (err) {
      console.warn(err);
    }

    gaEvent('App', enable ? 'enable autostart' : 'disable autostart');
  }

  @action _openExternalUrl({
    url,
  }) {
    const parsedUrl = new URL(url);
    debug('open external url', parsedUrl);

    if (isValidExternalURL(url)) {
      shell.openExternal(url);
    }
  }

  @action _checkForUpdates() {
    if (this.isOnline) {
      this.updateStatus = this.updateStatusTypes.CHECKING;
      ipcRenderer.send('autoUpdate', {
        action: 'check',
      });

      this.actions.recipe.update();
    }
  }

  @action _installUpdate() {
    ipcRenderer.send('autoUpdate', {
      action: 'install',
    });
  }

  @action _resetUpdateStatus() {
    this.updateStatus = null;
  }

  @action _healthCheck() {
    this.healthCheckRequest.execute();
  }

  @action _muteApp({
    isMuted,
    overrideSystemMute = true,
  }) {
    this.isSystemMuteOverridden = overrideSystemMute;
    this.actions.settings.update({
      type: 'app',
      data: {
        isAppMuted: isMuted,
      },
    });
  }

  @action _toggleMuteApp() {
    this._muteApp({
      isMuted: !this.stores.settings.all.app.isAppMuted,
    });
  }

  @action async _clearAllCache() {
    this.isClearingAllCache = true;
    const clearAppCache = this.clearAppCacheRequest.execute();
    const allServiceIds = await getServiceIdsFromPartitions();
    const allOrphanedServiceIds = allServiceIds.filter(id => !this.stores.services.all.find(s => id.replace('service-', '') === s.id));

    await Promise.all(allOrphanedServiceIds.map(id => removeServicePartitionDirectory(id)));

    await Promise.all(this.stores.services.all.map(s => this.actions.service.clearCache({
      serviceId: s.id,
    })));

    await clearAppCache._promise;

    await sleep(ms('1s'));

    this.getAppCacheSizeRequest.execute();

    this.isClearingAllCache = false;
  }

  // Reactions
  _offlineCheck() {
    if (!this.isOnline) {
      this.timeOfflineStart = moment();
    } else {
      const deltaTime = moment().diff(this.timeOfflineStart);

      if (deltaTime > ms('30m')) {
        this.actions.service.reloadAll();
      }
    }
  }

  _setLocale() {
    let locale;
    if (this.stores.user.isLoggedIn) {
      locale = this.stores.user.data.locale;
    }


    if (locale && Object.prototype.hasOwnProperty.call(locales, locale) && locale !== this.locale) {
      this.locale = locale;
    } else if (!locale) {
      this.locale = this._getDefaultLocale();
    }

    moment.locale(this.locale);

    debug(`Set locale to "${this.locale}"`);
  }

  _getDefaultLocale() {
    return getLocale({
      locale: app.getLocale(),
      locales,
      defaultLocale,
      fallbackLocale: DEFAULT_APP_SETTINGS.fallbackLocale,
    });
  }

  _muteAppHandler() {
    const { showMessageBadgesEvenWhenMuted } = this.stores.ui;

    if (!showMessageBadgesEvenWhenMuted) {
      this.actions.app.setBadge({
        unreadDirectMessageCount: 0,
        unreadIndirectMessageCount: 0,
      });
    }
  }

  _handleFullScreen() {
    const body = document.querySelector('body');

    if (this.isFullScreen) {
      body.classList.add('isFullScreen');
    } else {
      body.classList.remove('isFullScreen');
    }
  }

  _handleLogout() {
    if (!this.stores.user.isLoggedIn) {
      clearInterval(this.fetchDataInterval);
    }
  }

  _shareMenuData() {
    ipcRenderer.send(WINDOWS_TITLEBAR_FETCH_MENU, JSON.parse(JSON.stringify({
      user: {
        isLoggedIn: this.stores.user.isLoggedIn,
        isPremium: this.stores.user.isPremium,
      },
      services: this.stores.services.allDisplayed,
      workspaces: this.stores.workspaces.workspaces,
      app: {
        isTodosEnabled: this.stores.todos.isFeatureEnabledByUser,
        isTodosDrawerOpen: this.stores.todos.isTodosPanelVisible,
        isWorkspaceFeatureEnabled: this.stores.workspaces.isFeatureEnabled,
        isWorkspaceDrawerOpen: this.stores.workspaces.isWorkspaceDrawerOpen,
      },
    })));
  }

  _handleMacOSPermissionsCheck() {
    if (this.stores.user.isLoggedIn && !this.stores.ui.isAuthRouteActive) {
      setTimeout(() => {
        ipcRenderer.send(CHECK_MACOS_PERMISSIONS);
      }, ms('5s'));
    }
  }

  // Helpers
  _appStartsCounter() {
    this.actions.settings.update({
      type: 'stats',
      data: {
        appStarts: (this.stores.settings.all.stats.appStarts || 0) + 1,
      },
    });
  }

  async _autoStart() {
    this.autoLaunchOnStart = await this._checkAutoStart();

    if (this.stores.settings.all.stats.appStarts === 1) {
      debug('Set app to launch on start');
      this.actions.app.launchOnStartup({
        enable: true,
      });
    }
  }

  async _checkAutoStart() {
    const { openAtLogin, executableWillLaunchAtLogin } = app.getLoginItemSettings();
    debug('Open app at login setting', openAtLogin);

    return (isWindows ? executableWillLaunchAtLogin : openAtLogin) || false;
  }

  async _systemDND() {
    debug('Checking if Do Not Disturb Mode is on');
    const dnd = await ipcRenderer.invoke('get-dnd');
    debug('Do not disturb mode is', dnd);
    // ipcRenderer.on('autoUpdate', (event, data) => {
    if (dnd !== this.stores.settings.all.app.isAppMuted && !this.isSystemMuteOverridden) {
      this.actions.app.muteApp({
        isMuted: dnd,
        overrideSystemMute: false,
      });
    }
  }
}
