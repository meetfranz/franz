import { ipcRenderer } from 'electron';
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

  @computed get all() {
    return new SettingsModel({
      app: this.appSettingsRequest.execute().result || {},
      service: localStorage.getItem('service') || {},
      group: localStorage.getItem('group') || {},
      stats: localStorage.getItem('stats') || {},
    });
  }

  @action async _update({ type, data }) {
    debug('Update settings', type, data, this.all);
    const appSettings = this.all;
    if (type !== 'app') {
      localStorage.setItem(type, Object.assign(appSettings[type], data));
    } else {
      debug('Store app settings on file system', type, data);
      this.updateAppSettingsRequest.execute(data);

      this.appSettingsRequest.patch((result) => {
        if (!result) return;
        Object.assign(result, data);
      });
    }
  }

  @action async _remove({ key }) {
    const appSettings = this.all;
    if (Object.hasOwnProperty.call(appSettings, key)) {
      delete appSettings[key];
      localStorage.setItem('app', appSettings);
    }

    this._shareSettingsWithMainProcess();
  }

  // Reactions
  _shareSettingsWithMainProcess() {
    ipcRenderer.send('settings', this.all);
  }
}
