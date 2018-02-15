import { ipcRenderer } from 'electron';
import { action, computed } from 'mobx';
import localStorage from 'mobx-localstorage';

import Store from './lib/Store';
import { gaEvent } from '../lib/analytics';
import SettingsModel from '../models/Settings';

export default class SettingsStore extends Store {
  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.settings.update.listen(this._update.bind(this));
    this.actions.settings.remove.listen(this._remove.bind(this));
  }

  setup() {
    this._shareSettingsWithMainProcess();
  }

  @computed get all() {
    return new SettingsModel(localStorage.getItem('app') || {});
  }

  @action async _update({ settings }) {
    const appSettings = this.all;
    localStorage.setItem('app', Object.assign(appSettings, settings));

    // We need a little hack to wait until everything is patched
    setTimeout(() => this._shareSettingsWithMainProcess(), 0);

    gaEvent('Settings', 'update');
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
