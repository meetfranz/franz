import { reaction } from 'mobx';
import { AnnouncementsStore } from './store';

const debug = require('debug')('Franz:feature:announcements');

export const GA_CATEGORY_ANNOUNCEMENTS = 'Announcements';

export const announcementsStore = new AnnouncementsStore();

export const ANNOUNCEMENTS_ROUTES = {
  TARGET: '/announcements/:id',
};

export default function initAnnouncements(stores, actions) {
  // const { features } = stores;

  // Toggle workspace feature
  reaction(
    () => (
      true
      // features.features.isAnnouncementsEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `announcements` feature');
        announcementsStore.start(stores, actions);
      } else if (announcementsStore.isFeatureActive) {
        debug('Disabling `announcements` feature');
        announcementsStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}
