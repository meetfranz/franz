import { observable, reaction } from 'mobx';
import { merge } from 'lodash';
import WorkspacesStore from './store';
import api from './api';

const debug = require('debug')('Franz:feature:workspaces');

let store = null;
const defaultState = { workspaces: [] };

export const state = observable(defaultState);

export default function initWorkspaces(stores, actions) {
  const { features, user } = stores;
  reaction(
    () => features.features.isWorkspaceEnabled && user.isLoggedIn,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `workspaces` feature');
        store = new WorkspacesStore(stores, api, actions, state);
        store.initialize();
      } else if (store) {
        debug('Disabling `workspaces` feature');
        store.teardown();
        store = null;
        // Reset state to default
        merge(state, defaultState);
      }
    },
    {
      fireImmediately: true,
    },
  );
}
