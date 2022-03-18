import { webContents } from '@electron/remote';
import {
  computed, observable, autorun,
} from 'mobx';
import path from 'path';
import normalizeUrl from 'normalize-url';
import { TODOS_RECIPE_ID } from '../config';

export const RESTRICTION_TYPES = {
  SERVICE_LIMIT: 0,
  CUSTOM_URL: 1,
};

export default class Service {
  id = '';

  recipe = '';

  _webview = null;

  timer = null;

  events = {};

  @observable isActive = false; // Is current webview active

  @observable name = '';

  @observable unreadDirectMessageCount = 0;

  @observable unreadIndirectMessageCount = 0;

  @observable order = 99;

  @observable isEnabled = true;

  @observable isMuted = false;

  @observable team = '';

  @observable customUrl = '';

  @observable isNotificationEnabled = true;

  @observable isBadgeEnabled = true;

  @observable isIndirectMessageBadgeEnabled = true;

  @observable iconUrl = '';

  @observable hasCustomUploadedIcon = false;

  @observable hasCrashed = false;

  @observable isDarkModeEnabled = false;

  @observable spellcheckerLanguage = null;

  @observable isFirstLoad = false;

  @observable isLoading = false;

  @observable isError = false;

  @observable errorMessage = '';

  @observable isUsingCustomUrl = false;

  @observable isServiceAccessRestricted = false;

  @observable restrictionType = null;

  @observable isHibernationEnabled = false;

  @observable isHibernating = false;

  @observable lastUsed = Date.now(); // timestamp

  @observable chromelessUserAgent = false;

  @observable webContentsId = null;

  constructor(data, recipe) {
    if (!data) {
      console.error('Service config not valid');
      return null;
    }

    if (!recipe) {
      console.error('Service recipe not valid');
      return null;
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.team = data.team || this.team;
    this.customUrl = data.customUrl || this.customUrl;
    // this.customIconUrl = data.customIconUrl || this.customIconUrl;
    this.iconUrl = data.iconUrl || this.iconUrl;

    this.order = data.order !== undefined
      ? data.order : this.order;

    this.isEnabled = data.isEnabled !== undefined
      ? data.isEnabled : this.isEnabled;

    this.isNotificationEnabled = data.isNotificationEnabled !== undefined
      ? data.isNotificationEnabled : this.isNotificationEnabled;

    this.isBadgeEnabled = data.isBadgeEnabled !== undefined
      ? data.isBadgeEnabled : this.isBadgeEnabled;

    this.isIndirectMessageBadgeEnabled = data.isIndirectMessageBadgeEnabled !== undefined
      ? data.isIndirectMessageBadgeEnabled : this.isIndirectMessageBadgeEnabled;

    this.isMuted = data.isMuted !== undefined ? data.isMuted : this.isMuted;

    this.isDarkModeEnabled = data.isDarkModeEnabled !== undefined ? data.isDarkModeEnabled : this.isDarkModeEnabled;

    this.hasCustomUploadedIcon = data.hasCustomIcon !== undefined ? data.hasCustomIcon : this.hasCustomUploadedIcon;

    this.proxy = data.proxy !== undefined ? data.proxy : this.proxy;

    this.spellcheckerLanguage = data.spellcheckerLanguage !== undefined ? data.spellcheckerLanguage : this.spellcheckerLanguage;

    this.isHibernationEnabled = data.isHibernationEnabled !== undefined ? data.isHibernationEnabled : this.isHibernationEnabled;

    this.recipe = recipe;

    autorun(() => {
      if (!this.isEnabled) {
        this.webContentsId = null;
        this.unreadDirectMessageCount = 0;
        this.unreadIndirectMessageCount = 0;
      }

      if (this.recipe.hasCustomUrl && this.customUrl) {
        this.isUsingCustomUrl = true;
      }
    });
  }

  @computed get shareWithWebview() {
    return {
      id: this.id,
      spellcheckerLanguage: this.spellcheckerLanguage,
      isDarkModeEnabled: this.isDarkModeEnabled,
      team: this.team,
      url: this.url,
      hasCustomIcon: this.hasCustomIcon,
    };
  }

  @computed get isServiceInterrupted() {
    return (this.isLoading && this.isFirstLoad) || this.hasCrashed || this.isError || this.isServiceAccessRestricted;
  }

  @computed get isAttached() {
    return this.webContentsId !== null;
  }

  @computed get url() {
    if (this.recipe.hasCustomUrl && this.customUrl) {
      let url;
      try {
        url = normalizeUrl(this.customUrl, { stripWWW: false });
      } catch (err) {
        console.error(`Service (${this.recipe.name}): '${this.customUrl}' is not a valid Url.`);
      }

      if (typeof this.recipe.buildUrl === 'function') {
        url = this.recipe.buildUrl(url);
      }

      return url;
    }

    if (this.recipe.hasTeamId && this.team) {
      return this.recipe.serviceURL.replace('{teamId}', this.team);
    }

    return this.recipe.serviceURL;
  }

  @computed get icon() {
    if (this.iconUrl) {
      return this.iconUrl;
    }

    return path.join(this.recipe.path, 'icon.svg');
  }

  @computed get hasCustomIcon() {
    return Boolean(this.iconUrl);
  }

  @computed get iconPNG() {
    return path.join(this.recipe.path, 'icon.png');
  }

  @computed get webContents() {
    return webContents.fromId(this.webContentsId);
  }

  @computed get partition() {
    return this.recipe.partition || `persist:service-${this.id}`;
  }

  @computed get isTodos() {
    return this.recipe.id === TODOS_RECIPE_ID;
  }

  resetMessageCount() {
    this.unreadDirectMessageCount = 0;
    this.unreadIndirectMessageCount = 0;
  }
}
