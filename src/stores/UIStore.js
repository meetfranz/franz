import { action, observable, computed } from 'mobx';

import Store from './lib/Store';
import * as themeDefault from '../theme/default';
import * as themeDark from '../theme/dark';

export default class UIStore extends Store {
  @observable showServicesUpdatedInfoBar = false;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.ui.openSettings.listen(this._openSettings.bind(this));
    this.actions.ui.closeSettings.listen(this._closeSettings.bind(this));
    this.actions.ui.toggleServiceUpdatedInfoBar.listen(this._toggleServiceUpdatedInfoBar.bind(this));
    this.actions.ui.changeTheme.listen(this._changeTheme.bind(this));
  }

  @computed get showMessageBadgesEvenWhenMuted() {
    const settings = this.stores.settings.all;

    return (settings.app.isAppMuted && settings.app.showMessageBadgeWhenMuted) || !settings.isAppMuted;
  }

  @computed get theme() {
    if (this.stores.settings.all.app.darkMode) {
      return Object.assign({}, themeDefault, themeDark);
    }

    return themeDefault;
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

  @action _changeTheme(themeName) {
    const currentClassList = document.body.classList;
    if (themeName && !currentClassList.contains(themeName)) {
      let name = themeName;
      if (!themeName.startsWith('theme-')) {
        name = `theme-${themeName}`;
      }
      [...currentClassList].forEach((c) => {
        if (c && c.startsWith('theme-')) {
          document.body.classList.remove(c);
        }
      });
      this.actions.service.changeServicesTheme(themeName);
      if (name === 'theme-regular') {
        return;
      }
      document.body.classList.add(name);
    }
  }
}
