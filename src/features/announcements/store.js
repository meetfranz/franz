import {
  action,
  computed,
  observable,
  reaction,
} from 'mobx';
import semver from 'semver';
import localStorage from 'mobx-localstorage';

import { FeatureStore } from '../utils/FeatureStore';
import { getAnnouncementRequest, getChangelogRequest, getCurrentVersionRequest } from './api';
import { announcementActions } from './actions';

const LOCAL_STORAGE_KEY = 'announcements';

const debug = require('debug')('Franz:feature:announcements:store');

export class AnnouncementsStore extends FeatureStore {
  @observable targetVersion = null;

  @observable isAnnouncementVisible = false;

  @observable isFeatureActive = false;

  @computed get changelog() {
    return getChangelogRequest.result;
  }

  @computed get announcement() {
    return getAnnouncementRequest.result;
  }

  @computed get settings() {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || {};
  }

  @computed get lastSeenAnnouncementVersion() {
    return this.settings.lastSeenAnnouncementVersion || null;
  }

  @computed get currentVersion() {
    return getCurrentVersionRequest.result;
  }

  @computed get isNewUser() {
    return this.stores.settings.stats.appStarts <= 1;
  }

  async start(stores, actions) {
    debug('AnnouncementsStore::start');
    this.stores = stores;
    this.actions = actions;
    getCurrentVersionRequest.execute();

    this._registerActions([
      [announcementActions.show, this._showAnnouncement],
    ]);

    this._registerReactions([
      this._fetchAnnouncements,
      this._showAnnouncementToUsersWhoUpdatedApp,
    ]);
    this.isFeatureActive = true;
  }

  stop() {
    super.stop();
    debug('AnnouncementsStore::stop');
    this.isFeatureActive = false;
    this.isAnnouncementVisible = false;
  }

  // ======= HELPERS ======= //

  _updateSettings = (changes) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, {
      ...this.settings,
      ...changes,
    });
  };

  // ======= ACTIONS ======= //

  @action _showAnnouncement = ({ targetVersion } = {}) => {
    this.targetVersion = targetVersion || this.currentVersion;
    this.isAnnouncementVisible = true;
    this.actions.service.blurActive();
    this._updateSettings({
      lastSeenAnnouncementVersion: this.currentVersion,
    });
    const dispose = reaction(
      () => this.stores.services.active,
      () => {
        this._hideAnnouncement();
        dispose();
      },
    );
  };

  @action _hideAnnouncement() {
    this.isAnnouncementVisible = false;
  }

  // ======= REACTIONS ========

  _showAnnouncementToUsersWhoUpdatedApp = () => {
    const { announcement, isNewUser } = this;
    console.log(announcement, isNewUser);
    // Check if there is an announcement and on't show announcements to new users
    if (!announcement || isNewUser) return;

    this._showAnnouncement();

    // Check if the user has already used current version (= has seen the announcement)
    const { currentVersion, lastSeenAnnouncementVersion } = this;
    if (semver.gt(currentVersion, lastSeenAnnouncementVersion)) {
      debug(`${currentVersion} < ${lastSeenAnnouncementVersion}: announcement is shown`);
      this._showAnnouncement();
    } else {
      debug(`${currentVersion} >= ${lastSeenAnnouncementVersion}: announcement is hidden`);
      this._hideAnnouncement();
    }
  };

  _fetchAnnouncements = () => {
    const targetVersion = this.targetVersion || this.currentVersion;
    if (!targetVersion) return;
    getChangelogRequest.execute('5.0.1');
    getAnnouncementRequest.execute('5.1.0');
  }
}
