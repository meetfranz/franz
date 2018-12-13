import { ipcRenderer } from 'electron';
import {
  action, computed, observable, set,
} from 'mobx';
import localStorage from 'mobx-localstorage';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { getLocale } from '../helpers/i18n-helpers';

import { DEFAULT_APP_SETTINGS, FILE_SYSTEM_SETTINGS_TYPES } from '../config';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';

const debug = require('debug')('Franz:SettingsStore');

export default class SettingsStore extends Store {
  @observable appSettingsRequest = new CachedRequest(this.api.local, 'getAppSettings');

  @observable updateAppSettingsRequest = new Request(this.api.local, 'updateAppSettings');

  fileSystemSettingsRequests = [];

  fileSystemSettingsTypes = FILE_SYSTEM_SETTINGS_TYPES;

  @observable _fileSystemSettingsCache = {
    app: DEFAULT_APP_SETTINGS,
    proxy: {},
  };

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.settings.update.listen(this._update.bind(this));
    this.actions.settings.remove.listen(this._remove.bind(this));

    this.fileSystemSettingsTypes.forEach((type) => {
      this.fileSystemSettingsRequests[type] = new CachedRequest(this.api.local, 'getAppSettings');
    });

    ipcRenderer.on('appSettings', (event, resp) => {
      debug('Get appSettings resolves', resp.type, resp.data);

      this._fileSystemSettingsCache[resp.type] = resp.data;
    });

    this.fileSystemSettingsTypes.forEach((type) => {
      ipcRenderer.send('getAppSettings', type);
    });
  }

  async setup() {
    // We need to wait until `appSettingsRequest` has been executed once, otherwise we can't patch the result. If we don't wait we'd run into an issue with mobx not reacting to changes of previously not existing keys
    await this.appSettingsRequest._promise;
    await this._migrate();
  }

  @computed get app() {
    return this._fileSystemSettingsCache.app || DEFAULT_APP_SETTINGS;
  }

  @computed get proxy() {
    // // We need to provide the final data structure as mobx autoruns won't work
    // const proxySettings = observable({});
    // this.stores.services.all.forEach((service) => {
    //   proxySettings[service.id] = {
    //     isEnabled: false,
    //     host: null,
    //     user: null,
    //     password: null,
    //   };
    // });

    // debug('this._fileSystemSettingsCache.proxy', this._fileSystemSettingsCache.proxy, proxySettings);

    // return Object.assign(proxySettings, this._fileSystemSettingsCache.proxy);

    return this._fileSystemSettingsCache.proxy || {};
  }

  @computed get service() {
    return localStorage.getItem('service') || {
      activeService: '',
    };
  }

  @computed get stats() {
    return localStorage.getItem('stats') || {
      activeService: '',
    };
  }

  @computed get migration() {
    return localStorage.getItem('migration') || {};
  }

  @computed get all() {
    return {
      app: this.app,
      proxy: this.proxy,
      service: this.service,
      stats: this.stats,
      migration: this.migration,
    };
  }

  @action async _update({ type, data }) {
    const appSettings = this.all;
    if (!this.fileSystemSettingsTypes.includes(type)) {
      debug('Update settings', type, data, this.all);
      localStorage.setItem(type, Object.assign(appSettings[type], data));
    } else {
      debug('Update settings on file system', type, data);
      ipcRenderer.send('updateAppSettings', {
        type,
        data,
      });

      set(this._fileSystemSettingsCache[type], data);
    }
  }

  @action async _remove({ type, key }) {
    if (type === 'app') return; // app keys can't be deleted

    const appSettings = this.all[type];
    if (Object.hasOwnProperty.call(appSettings, key)) {
      delete appSettings[key];

      this.actions.settings.update({
        type,
        data: appSettings,
      });
    }
  }

  // Helper
  async _migrate() {
    const legacySettings = localStorage.getItem('app') || {};

    if (!this.all.migration['5.0.0-beta.17-settings']) {
      this.actions.settings.update({
        type: 'app',
        data: {
          autoLaunchInBackground: legacySettings.autoLaunchInBackground,
          runInBackground: legacySettings.runInBackground,
          enableSystemTray: legacySettings.enableSystemTray,
          minimizeToSystemTray: legacySettings.minimizeToSystemTray,
          isAppMuted: legacySettings.isAppMuted,
          enableGPUAcceleration: legacySettings.enableGPUAcceleration,
          showMessageBadgeWhenMuted: legacySettings.showMessageBadgeWhenMuted,
          showDisabledServices: legacySettings.showDisabledServices,
          enableSpellchecking: legacySettings.enableSpellchecking,
        },
      });

      this.actions.settings.update({
        type: 'service',
        data: {
          activeService: legacySettings.activeService,
        },
      });

      this.actions.settings.update({
        type: 'migration',
        data: {
          '5.0.0-beta.17-settings': true,
        },
      });

      localStorage.removeItem('app');

      debug('Migrated settings to split stores');
    }

    if (!this.all.migration['5.0.0-beta.19-settings']) {
      const spellcheckerLanguage = getLocale({
        locale: this.stores.settings.app.locale,
        locales: SPELLCHECKER_LOCALES,
        defaultLocale: DEFAULT_APP_SETTINGS.spellcheckerLanguage,
        fallbackLocale: DEFAULT_APP_SETTINGS.spellcheckerLanguage,
      });

      this.actions.settings.update({
        type: 'app',
        data: {
          spellcheckerLanguage,
        },
      });

      this.actions.settings.update({
        type: 'migration',
        data: {
          '5.0.0-beta.19-settings': true,
        },
      });
    }
  }

  _getFileBasedSettings(type) {
    ipcRenderer.send('getAppSettings', type);
  }
}
