import { ipcRenderer } from 'electron';
import { action, computed, observable, extendObservable } from 'mobx';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { gaEvent } from '../lib/analytics';
import SettingsModel from '../models/Settings';

export default class SettingsStore extends Store {
  @observable allSettingsRequest = new CachedRequest(this.api.local, 'getSettings');
  @observable updateSettingsRequest = new Request(this.api.local, 'updateSettings');
  @observable removeSettingsKeyRequest = new Request(this.api.local, 'removeKey');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.settings.update.listen(this._update.bind(this));
    this.actions.settings.remove.listen(this._remove.bind(this));
  }

  setup() {
    this.allSettingsRequest.execute();
    this._shareSettingsWithMainProcess();
  }

  @computed get all() {
    return new SettingsModel(this.allSettingsRequest.result);
  }

  @action async _update({ settings }) {
    await this.updateSettingsRequest.execute(settings)._promise;
    await this.allSettingsRequest.patch((result) => {
      if (!result) return;
      extendObservable(result, settings);
    });

    // We need a little hack to wait until everything is patched
    setTimeout(() => this._shareSettingsWithMainProcess(), 0);

    gaEvent('Settings', 'update');
  }

  @action async _remove({ key }) {
    await this.removeSettingsKeyRequest.execute(key);
    await this.allSettingsRequest.invalidate({ immediately: true });

    this._shareSettingsWithMainProcess();
  }

  // Reactions
  _shareSettingsWithMainProcess() {
    ipcRenderer.send('settings', this.all);
  }
}
