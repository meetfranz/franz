import { observable, toJS } from 'mobx';
import { pathExistsSync, outputJsonSync, readJsonSync } from 'fs-extra';

import { SETTINGS_PATH, DEFAULT_APP_SETTINGS } from '../config';

const debug = require('debug')('Settings');

export default class Settings {
  @observable store = {
    autoLaunchInBackground: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
    runInBackground: DEFAULT_APP_SETTINGS.runInBackground,
    enableSystemTray: DEFAULT_APP_SETTINGS.enableSystemTray,
    minimizeToSystemTray: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
    locale: DEFAULT_APP_SETTINGS.locale,
    beta: DEFAULT_APP_SETTINGS.beta,
    isAppMuted: DEFAULT_APP_SETTINGS.isAppMuted,
    showMessageBadgeWhenMuted: DEFAULT_APP_SETTINGS.showMessageBadgeWhenMuted,
    showDisabledServices: DEFAULT_APP_SETTINGS.showDisabledServices,
    enableSpellchecking: DEFAULT_APP_SETTINGS.enableSpellchecking,
  };

  constructor() {
    if (!pathExistsSync(SETTINGS_PATH)) {
      this._writeFile();
    } else {
      this._hydrate();
    }
  }

  set(settings) {
    this.store = Object.assign(this.store, settings);

    this._writeFile();
  }

  get all() {
    return this.store;
  }

  get(key) {
    return this.store[key];
  }

  _hydrate() {
    this.store = readJsonSync(SETTINGS_PATH);
    debug('Hydrate store', toJS(this.store));
  }

  _writeFile() {
    outputJsonSync(SETTINGS_PATH, this.store);
    debug('Write settings file', toJS(this.store));
  }
}
