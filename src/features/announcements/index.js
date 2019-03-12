import { reaction, runInAction } from 'mobx';
import { AnnouncementsStore } from './store';
import api from './api';
import state, { resetState } from './state';

const debug = require('debug')('Franz:feature:announcements');

let store = null;

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
        store = new AnnouncementsStore(stores, api, actions, state);
        store.initialize();
        runInAction(() => { state.isFeatureActive = true; });
      } else if (store) {
        debug('Disabling `announcements` feature');
        runInAction(() => { state.isFeatureActive = false; });
        store.teardown();
        store = null;
        resetState(); // Reset state to default
      }
    },
    {
      fireImmediately: true,
    },
  );
}
