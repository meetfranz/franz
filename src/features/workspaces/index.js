import { reaction } from 'mobx';
import WorkspacesStore from './store';
import { resetApiRequests } from './api';

const debug = require('debug')('Franz:feature:workspaces');

export const GA_CATEGORY_WORKSPACES = 'Workspaces';

export const workspaceStore = new WorkspacesStore();

export default function initWorkspaces(stores, actions) {
  stores.workspaces = workspaceStore;
  const { features } = stores;

  // Toggle workspace feature
  reaction(
    () => features.features.isWorkspaceEnabled,
    (isEnabled) => {
      if (isEnabled && !workspaceStore.isFeatureActive) {
        debug('Initializing `workspaces` feature');
        workspaceStore.start(stores, actions);
      } else if (workspaceStore.isFeatureActive) {
        debug('Disabling `workspaces` feature');
        workspaceStore.stop();
        resetApiRequests();
      }
    },
    {
      fireImmediately: true,
    },
  );
}

export const WORKSPACES_ROUTES = {
  ROOT: '/settings/workspaces',
  EDIT: '/settings/workspaces/:action/:id',
};
