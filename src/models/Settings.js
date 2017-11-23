import { observable } from 'mobx';
import { DEFAULT_APP_SETTINGS } from '../config';

export default class Settings {
  @observable autoLaunchOnStart = DEFAULT_APP_SETTINGS.autoLaunchOnStart;
  @observable autoLaunchInBackground = DEFAULT_APP_SETTINGS.autoLaunchInBackground;
  @observable runInBackground = DEFAULT_APP_SETTINGS.runInBackground;
  @observable enableSystemTray = DEFAULT_APP_SETTINGS.enableSystemTray;
  @observable minimizeToSystemTray = DEFAULT_APP_SETTINGS.minimizeToSystemTray;
  @observable showDisabledServices = DEFAULT_APP_SETTINGS.showDisabledServices;
  @observable enableSpellchecking = DEFAULT_APP_SETTINGS.enableSpellchecking;
  @observable locale = DEFAULT_APP_SETTINGS.locale;
  @observable beta = DEFAULT_APP_SETTINGS.beta;
  @observable isAppMuted = DEFAULT_APP_SETTINGS.isAppMuted;

  constructor(data) {
    Object.assign(this, data);
  }
}
