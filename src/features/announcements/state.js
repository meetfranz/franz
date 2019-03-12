import { observable } from 'mobx';

const defaultState = {
  announcement: null,
  currentVersion: null,
  lastUsedVersion: null,
  isAnnouncementVisible: false,
  isFeatureActive: false,
};

export const announcementsState = observable(defaultState);

export function resetState() {
  Object.assign(announcementsState, defaultState);
}

export default announcementsState;
