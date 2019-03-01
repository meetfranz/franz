import { reaction, runInAction } from 'mobx';
import WorkspacesStore from './store';
import api from './api';
import { workspacesState, resetState } from './state';

const debug = require('debug')('Franz:feature:workspaces');

let store = null;

export const filterServicesByActiveWorkspace = (services) => {
  const { isFeatureActive, activeWorkspace } = workspacesState;
  if (isFeatureActive && activeWorkspace) {
    return services.filter(s => activeWorkspace.services.includes(s.id));
  }
  return services;
};

export const getActiveWorkspaceServices = services => (
  filterServicesByActiveWorkspace(services)
);

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
      if (isEnabled) {
        debug('Initializing `workspaces` feature');
        store = new WorkspacesStore(stores, api, actions, workspacesState);
        store.initialize();
        runInAction(() => { workspacesState.isFeatureActive = true; });
      } else if (store) {
        debug('Disabling `workspaces` feature');
        runInAction(() => { workspacesState.isFeatureActive = false; });
        store.teardown();
        store = null;
        resetState(); // Reset state to default
      }
    },
    {
      fireImmediately: true,
    },
  );

  // Update active service on workspace switches
  reaction(() => ({
    isFeatureActive: workspacesState.isFeatureActive,
    activeWorkspace: workspacesState.activeWorkspace,
  }), ({ isFeatureActive, activeWorkspace }) => {
    if (!isFeatureActive) return;
    if (activeWorkspace) {
      const services = stores.services.allDisplayed;
      const activeService = services.find(s => s.isActive);
      const workspaceServices = filterServicesByActiveWorkspace(services);
      const isActiveServiceInWorkspace = workspaceServices.includes(activeService);
      if (!isActiveServiceInWorkspace) {
        console.log(workspaceServices[0].id);
        actions.service.setActive({ serviceId: workspaceServices[0].id });
      }
    }
  });
}
