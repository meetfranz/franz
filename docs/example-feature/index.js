import { reaction, runInAction } from 'mobx';
import { ExampleFeatureStore } from './store';
import state, { resetState } from './state';
import api from './api';

const debug = require('debug')('Franz:feature:EXAMPLE_FEATURE');

let store = null;

export default function initAnnouncements(stores, actions) {
  const { features } = stores;

  // Toggle workspace feature
  reaction(
    () => (
      features.features.isExampleFeatureEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `EXAMPLE_FEATURE` feature');
        store = new ExampleFeatureStore(stores, api, actions, state);
        store.initialize();
        runInAction(() => { state.isFeatureActive = true; });
      } else if (store) {
        debug('Disabling `EXAMPLE_FEATURE` feature');
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
