import { action, computed, observable } from 'mobx';
import localStorage from 'mobx-localstorage';
import { DEFAULT_APP_SETTINGS } from '../config';
import SettingsModel from '../models/Settings';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

import Store from './lib/Store';

const debug = require('debug')('SettingsStore');

export default class SettingsStore extends Store {
  @observable appSettingsRequest = new CachedRequest(this.api.local, 'getAppSettings');
  @observable updateAppSettingsRequest = new Request(this.api.local, 'updateAppSettings');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.settings.appSettings = () => this._getAppSettings();
    this.actions.settings.update.listen(this._update.bind(this));
    this.actions.settings.remove.listen(this._remove.bind(this));
    this.actions.settings.setBackground.listen(this._setBackground.bind(this));
    this.actions.settings.resetBackground.listen(this._resetBackground.bind(this));
  }

  async setup() {
    // We need to wait until `appSettingsRequest` has been executed once, otherwise we can't patch the result. If we don't wait we'd run into an issue with mobx not reacting to changes of previously not existing keys
    await this.appSettingsRequest._promise;
    this._migrate();
  }

  @computed get all() {
    return new SettingsModel({
      app: this.appSettingsRequest.execute().result || {},
      service: localStorage.getItem('service') || {},
      group: localStorage.getItem('group') || {},
      stats: localStorage.getItem('stats') || {},
      migration: localStorage.getItem('migration') || {},
    });
  }

  @action async _getAppSettings() {
    return this.appSettingsRequest.execute().result;
  }

  @action async _update({ type, data }) {
    const appSettings = this.all;
    if (type !== 'app') {
      debug('Update settings', type, data, this.all);
      localStorage.setItem(type, Object.assign(appSettings[type], data));
    } else {
      debug('Update settings on file system', type, data);
      this.updateAppSettingsRequest.execute(data);

      this.appSettingsRequest.patch((result) => {
        if (!result) return;
        Object.assign(result, data);
        this.actions.ui.changeTheme(result.theme);
      });
    }
  }

  @action _setBackground(background) {
    if (background && typeof background === 'string') {
      document.body.style.backgroundImage = `url("${background}")`;
      this._update({ type: 'app', data: { appBackground: background } });
    }
  }

  @action _resetBackground() {
    document.body.style.backgroundImage = '';
    this._update({ type: 'app', data: { appBackground: DEFAULT_APP_SETTINGS.appBackground } });
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
  _migrate() {
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
          theme: legacySettings.theme,
          appBackground: legacySettings.appBackground,
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
  }
}
