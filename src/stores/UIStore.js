import {
  action,
  observable,
  computed,
  reaction,
} from 'mobx';
import { theme } from '@meetfranz/theme';

import { ipcRenderer } from 'electron';
import Store from './lib/Store';
import { HIDE_ALL_SERVICES, SETTINGS_NAVIGATE_TO, SHOW_ALL_SERVICES } from '../ipcChannels';

export default class UIStore extends Store {
  @observable showServicesUpdatedInfoBar = false;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.ui.openSettings.listen(this._openSettings.bind(this));
    this.actions.ui.closeSettings.listen(this._closeSettings.bind(this));
    this.actions.ui.toggleServiceUpdatedInfoBar.listen(this._toggleServiceUpdatedInfoBar.bind(this));
    this.actions.ui.hideServices.listen(this._hideServices.bind(this));
    this.actions.ui.showServices.listen(this._showServices.bind(this));

    this.registerReactions([
      [this._setServiceVisibility.bind(this)],
    ]);
  }

  setup() {
    reaction(
      () => this.isDarkThemeActive,
      () => this._setupThemeInDOM(),
      { fireImmediately: true },
    );

    ipcRenderer.on(SETTINGS_NAVIGATE_TO, (e, { path }) => {
      this._openSettings({ path });
    });

    // reaction(
    //   () => this.isServiceRouteActive,
    //   () => this._setServiceVisibility(),
    //   { delay: 5000 },
    // );
  }

  @computed get showMessageBadgesEvenWhenMuted() {
    const settings = this.stores.settings.all;

    return (settings.app.isAppMuted && settings.app.showMessageBadgeWhenMuted) || !settings.app.isAppMuted;
  }

  @computed get isDarkThemeActive() {
    return this.stores.settings.all.app.darkMode;
  }

  @computed get theme() {
    if (this.isDarkThemeActive || this.stores.settings.app.darkMode) return theme('dark');
    return theme('default');
  }

  @computed get isServiceRouteActive() {
    return this.stores.router.location.pathname === '/';
  }

  @computed get isSettingsRouteActive() {
    return this.stores.router.location.pathname.startsWith('/settings/');
  }

  @computed get isAuthRouteActive() {
    return this.stores.router.location.pathname.startsWith(this.stores.user.BASE_ROUTE);
  }

  @computed get isAnnouncementsRouteActive() {
    return this.stores.router.location.pathname.startsWith('/announcements/');
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

  @action _hideServices() {
    ipcRenderer.send(HIDE_ALL_SERVICES);
  }

  @action _showServices() {
    ipcRenderer.send(SHOW_ALL_SERVICES);
  }

  // Reactions
  _setServiceVisibility() {
    if (!this.isServiceRouteActive && this.stores.services.allDisplayed.length > 0) {
      this._hideServices();
    } else {
      this._showServices();
    }
  }

  _setupThemeInDOM() {
    const body = document.querySelector('body');

    if (!this.isDarkThemeActive) {
      body.classList.remove('theme__dark');
    } else {
      body.classList.add('theme__dark');
    }
  }
}
