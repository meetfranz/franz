import { reaction, runInAction } from 'mobx';
import { SettingsWSStore } from './store';
import state, { resetState } from './state';

const debug = require('debug')('Franz:feature:settingsWS');

let store = null;

export default function initSettingsWebSocket(stores, actions) {
  const { features } = stores;

  // Toggle SettingsWebSocket feature
  reaction(
    () => (
      features.features.isSettingsWSEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `settingsWS` feature');
        store = new SettingsWSStore(stores, null, actions, state);
        store.initialize();
        runInAction(() => { state.isFeatureActive = true; });
      } else if (store) {
        debug('Disabling `settingsWS` feature');
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
