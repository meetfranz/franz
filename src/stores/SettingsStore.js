import { action, computed, observable } from 'mobx';
import localStorage from 'mobx-localstorage';

import Store from './lib/Store';
import SettingsModel from '../models/Settings';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';

const debug = require('debug')('SettingsStore');

export default class SettingsStore extends Store {
  @observable appSettingsRequest = new CachedRequest(this.api.local, 'getAppSettings');
  @observable updateAppSettingsRequest = new Request(this.api.local, 'updateAppSettings');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.settings.update.listen(this._update.bind(this));
    this.actions.settings.remove.listen(this._remove.bind(this));
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
      });
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
  _migrate() {
    const legacySettings = localStorage.getItem('app');

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
  }
}
