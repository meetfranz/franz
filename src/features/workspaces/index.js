import { reaction } from 'mobx';
import WorkspacesStore from './store';
import { resetApiRequests } from './api';

const debug = require('debug')('Franz:feature:workspaces');

export const workspaceStore = new WorkspacesStore();

export default function initWorkspaces(stores, actions) {
  const { features, user } = stores;

  // Toggle workspace feature
  reaction(
    () => (
      features.features.isWorkspaceEnabled && (
        !features.features.isWorkspacePremiumFeature || user.data.isPremium
      )
    ),
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
