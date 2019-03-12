import { action, observable, reaction } from 'mobx';
import semver from 'semver';

import Request from '../../stores/lib/Request';
import Store from '../../stores/lib/Store';

const debug = require('debug')('Franz:feature:announcements:store');

export class AnnouncementsStore extends Store {
  @observable getCurrentVersion = new Request(this.api, 'getCurrentVersion');

  @observable getAnnouncement = new Request(this.api, 'getAnnouncementForVersion');

  constructor(stores, api, actions, state) {
    super(stores, api, actions);
    this.state = state;
  }

  async setup() {
    await this.fetchLastUsedVersion();
    await this.fetchCurrentVersion();
    await this.fetchReleaseAnnouncement();
    this.showAnnouncementIfNotSeenYet();

    this.actions.announcements.show.listen(this._showAnnouncement.bind(this));
  }

  // ====== PUBLIC ======

  async fetchLastUsedVersion() {
    debug('getting last used version from local storage');
    const lastUsedVersion = window.localStorage.getItem('lastUsedVersion');
    this._setLastUsedVersion(lastUsedVersion == null ? '0.0.0' : lastUsedVersion);
  }

  async fetchCurrentVersion() {
    debug('getting current version from api');
    const version = await this.getCurrentVersion.execute();
    this._setCurrentVersion(version);
  }

  async fetchReleaseAnnouncement() {
    debug('getting release announcement from api');
    try {
      const announcement = await this.getAnnouncement.execute(this.state.currentVersion);
      this._setAnnouncement(announcement);
    } catch (error) {
      this._setAnnouncement(null);
    }
  }

  showAnnouncementIfNotSeenYet() {
    const { announcement, currentVersion, lastUsedVersion } = this.state;
    if (announcement && semver.gt(currentVersion, lastUsedVersion)) {
      debug(`${currentVersion} < ${lastUsedVersion}: announcement is shown`);
      this._showAnnouncement();
    } else {
      debug(`${currentVersion} >= ${lastUsedVersion}: announcement is hidden`);
      this._hideAnnouncement();
    }
  }

  // ====== PRIVATE ======

  @action _setCurrentVersion(version) {
    debug(`setting current version to ${version}`);
    this.state.currentVersion = version;
  }

  @action _setLastUsedVersion(version) {
    debug(`setting last used version to ${version}`);
    this.state.lastUsedVersion = version;
  }

  @action _setAnnouncement(announcement) {
    debug(`setting announcement to ${announcement}`);
    this.state.announcement = announcement;
  }

  @action _showAnnouncement() {
    this.state.isAnnouncementVisible = true;
    this.actions.service.blurActive();
    const dispose = reaction(
      () => this.stores.services.active,
      () => {
        this._hideAnnouncement();
        dispose();
      },
    );
  }

  @action _hideAnnouncement() {
    this.state.isAnnouncementVisible = false;
  }
}
