import { observable } from 'mobx';

import { DEFAULT_APP_SETTINGS } from '../config';

export default class Settings {
  @observable store = {
    autoLaunchOnStart: DEFAULT_APP_SETTINGS.autoLaunchOnStart,
    autoLaunchInBackground: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
    runInBackground: DEFAULT_APP_SETTINGS.runInBackground,
    enableSystemTray: DEFAULT_APP_SETTINGS.enableSystemTray,
    minimizeToSystemTray: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
    locale: DEFAULT_APP_SETTINGS.locale,
    beta: DEFAULT_APP_SETTINGS.beta,
  };

  set(settings) {
    this.store = Object.assign(this.store, settings);
  }

  all() {
    return this.store;
  }

  get(key) {
    return this.store[key];
  }
}
