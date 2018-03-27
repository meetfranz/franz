import { observable, extendObservable } from 'mobx';
import { DEFAULT_APP_SETTINGS } from '../config';

export default class Settings {
  @observable app = {
    autoLaunchInBackground: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
    runInBackground: DEFAULT_APP_SETTINGS.runInBackground,
    enableSystemTray: DEFAULT_APP_SETTINGS.enableSystemTray,
    minimizeToSystemTray: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
    isAppMuted: DEFAULT_APP_SETTINGS.isAppMuted,
    showMessageBadgeWhenMuted: DEFAULT_APP_SETTINGS.showMessageBadgeWhenMuted,
    showDisabledServices: DEFAULT_APP_SETTINGS.showDisabledServices,
    enableSpellchecking: DEFAULT_APP_SETTINGS.enableSpellchecking,
    locale: DEFAULT_APP_SETTINGS.locale,
    beta: DEFAULT_APP_SETTINGS.beta,

  }

  @observable service = {
    activeService: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
  }

  @observable group = {
    collapsed: [],
    disabled: [],
  }

  @observable stats = {
    appStarts: 0,
  }

  constructor({ app, service, group, stats }) {
    Object.assign(this.app, app);
    Object.assign(this.service, service);
    Object.assign(this.group, group);
    Object.assign(this.stats, stats);
  }

  update(data) {
    extendObservable(this, data);
  }
}
