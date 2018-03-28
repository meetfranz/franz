import { observable, toJS } from 'mobx';
import { pathExistsSync, outputJsonSync, readJsonSync } from 'fs-extra';

import { SETTINGS_PATH, DEFAULT_APP_SETTINGS } from '../config';

const debug = require('debug')('Settings');

export default class Settings {
  @observable store = DEFAULT_APP_SETTINGS;

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
