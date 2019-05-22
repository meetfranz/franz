import {
  action,
  computed,
  observable,
} from 'mobx';
import semver from 'semver';
import localStorage from 'mobx-localstorage';

import { FeatureStore } from '../utils/FeatureStore';
import { ANNOUNCEMENTS_ROUTES, GA_CATEGORY_ANNOUNCEMENTS } from '.';
import { getAnnouncementRequest, getChangelogRequest, getCurrentVersionRequest } from './api';
import { announcementActions } from './actions';
import { createActionBindings } from '../utils/ActionBinding';
import { createReactions } from '../../stores/lib/Reaction';
import { gaEvent } from '../../lib/analytics';
import { matchRoute } from '../../helpers/routing-helpers';

const LOCAL_STORAGE_KEY = 'announcements';

const debug = require('debug')('Franz:feature:announcements:store');

export class AnnouncementsStore extends FeatureStore {
  @observable targetVersion = null;

  @observable isFeatureActive = false;

  @computed get changelog() {
    return getChangelogRequest.result;
  }

  @computed get announcement() {
    return getAnnouncementRequest.result;
  }

  @computed get areNewsAvailable() {
    const isChangelogAvailable = getChangelogRequest.wasExecuted && !!this.changelog;
    const isAnnouncementAvailable = getAnnouncementRequest.wasExecuted && !!this.announcement;
    return isChangelogAvailable || isAnnouncementAvailable;
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

    this._registerActions(createActionBindings([
      [announcementActions.show, this._showAnnouncement],
    ]));

    this._reactions = createReactions([
      this._showAnnouncementOnRouteMatch,
      this._showAnnouncementToUsersWhoUpdatedApp,
      this._fetchAnnouncements,
    ]);
    this._registerReactions(this._reactions);
    this.isFeatureActive = true;
  }

  stop() {
    super.stop();
    debug('AnnouncementsStore::stop');
    this.isFeatureActive = false;
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
    const { router } = this.stores;
    this.targetVersion = targetVersion || this.currentVersion;
    this._updateSettings({
      lastSeenAnnouncementVersion: this.currentVersion,
    });
    const targetRoute = `/announcements/${this.targetVersion}`;
    if (router.location.pathname !== targetRoute) {
      this.stores.router.push(targetRoute);
    }
    gaEvent(GA_CATEGORY_ANNOUNCEMENTS, 'show');
  };

  // ======= REACTIONS ========

  _showAnnouncementToUsersWhoUpdatedApp = () => {
    const { announcement, isNewUser } = this;
    // Check if there is an announcement and don't show announcements to new users
    if (!announcement || isNewUser) return;

    // Check if the user has already used current version (= has seen the announcement)
    const { currentVersion, lastSeenAnnouncementVersion } = this;
    if (semver.gt(currentVersion, lastSeenAnnouncementVersion || '0.0.0')) {
      debug(`${currentVersion} > ${lastSeenAnnouncementVersion}: announcement is shown`);
      this._showAnnouncement();
    }
  };

  _fetchAnnouncements = () => {
    const targetVersion = this.targetVersion || this.currentVersion;
    if (!targetVersion) return;
    getChangelogRequest.execute(targetVersion);
    getAnnouncementRequest.execute(targetVersion);
  };

  _showAnnouncementOnRouteMatch = () => {
    const { router } = this.stores;
    const match = matchRoute(ANNOUNCEMENTS_ROUTES.TARGET, router.location.pathname);
    if (match) {
      const targetVersion = match.id;
      this._showAnnouncement({ targetVersion });
    }
  }
}
