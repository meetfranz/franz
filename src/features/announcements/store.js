import { action, observable, reaction } from 'mobx';
import semver from 'semver';
import { FeatureStore } from '../utils/FeatureStore';
import { getAnnouncementRequest, getCurrentVersionRequest } from './api';

const debug = require('debug')('Franz:feature:announcements:store');

export class AnnouncementsStore extends FeatureStore {

  @observable announcement = null;

  @observable currentVersion = null;

  @observable lastUsedVersion = null;

  @observable isAnnouncementVisible = false;

  @observable isFeatureActive = false;

  async start(stores, actions) {
    debug('AnnouncementsStore::start');
    this.stores = stores;
    this.actions = actions;
    await this.fetchLastUsedVersion();
    await this.fetchCurrentVersion();
    await this.fetchReleaseAnnouncement();
    this.showAnnouncementIfNotSeenYet();

    this.actions.announcements.show.listen(this._showAnnouncement.bind(this));
    this.isFeatureActive = true;
  }

  stop() {
    debug('AnnouncementsStore::stop');
    this.isFeatureActive = false;
    this.isAnnouncementVisible = false;
  }

  // ====== PUBLIC ======

  async fetchLastUsedVersion() {
    debug('getting last used version from local storage');
    const lastUsedVersion = window.localStorage.getItem('lastUsedVersion');
    this._setLastUsedVersion(lastUsedVersion == null ? '0.0.0' : lastUsedVersion);
  }

  async fetchCurrentVersion() {
    debug('getting current version from api');
    const version = await getCurrentVersionRequest.execute();
    this._setCurrentVersion(version);
  }

  async fetchReleaseAnnouncement() {
    debug('getting release announcement from api');
    try {
      const announcement = await getAnnouncementRequest.execute(this.currentVersion);
      this._setAnnouncement(announcement);
    } catch (error) {
      this._setAnnouncement(null);
    }
  }

  showAnnouncementIfNotSeenYet() {
    const { announcement, currentVersion, lastUsedVersion } = this;
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
    this.currentVersion = version;
  }

  @action _setLastUsedVersion(version) {
    debug(`setting last used version to ${version}`);
    this.lastUsedVersion = version;
  }

  @action _setAnnouncement(announcement) {
    debug(`setting announcement to ${announcement}`);
    this.announcement = announcement;
  }

  @action _showAnnouncement() {
    this.isAnnouncementVisible = true;
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
    this.isAnnouncementVisible = false;
  }
}
