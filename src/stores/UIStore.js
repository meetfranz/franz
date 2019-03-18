import { action, observable, computed } from 'mobx';
import { theme } from '@meetfranz/theme';

import Store from './lib/Store';

export default class UIStore extends Store {
  @observable showServicesUpdatedInfoBar = false;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.ui.openSettings.listen(this._openSettings.bind(this));
    this.actions.ui.closeSettings.listen(this._closeSettings.bind(this));
    this.actions.ui.toggleServiceUpdatedInfoBar.listen(this._toggleServiceUpdatedInfoBar.bind(this));
  }

  @computed get showMessageBadgesEvenWhenMuted() {
    const settings = this.stores.settings.all;

    return (settings.app.isAppMuted && settings.app.showMessageBadgeWhenMuted) || !settings.isAppMuted;
  }

  @computed get theme() {
    if (this.stores.settings.all.app.darkMode) {
      return theme('dark');
    }

    return theme('default');
  }

  // Actions
  @action _openSettings({ path = '/settings' }) {
    const settingsPath = path !== '/settings' ? `/settings/${path}` : path;
    this.stores.router.push(settingsPath);
  }

  @action _closeSettings() {
    this.stores.router.push('/');
  }

  @action _toggleServiceUpdatedInfoBar({ visible }) {
    let visibility = visible;
    if (visibility === null) {
      visibility = !this.showServicesUpdatedInfoBar;
    }
    this.showServicesUpdatedInfoBar = visibility;
  }
}
