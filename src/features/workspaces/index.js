import { reaction } from 'mobx';
import WorkspacesStore from './store';
import api from './api';
import { state, resetState } from './state';

const debug = require('debug')('Franz:feature:workspaces');

let store = null;

export default function initWorkspaces(stores, actions) {
  const { features, user } = stores;
  reaction(
    () => (
      features.features.isWorkspaceEnabled && (
        !features.features.isWorkspacePremiumFeature || user.data.isPremium
      )
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `workspaces` feature');
        store = new WorkspacesStore(stores, api, actions, state);
        store.initialize();
      } else if (store) {
        debug('Disabling `workspaces` feature');
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
