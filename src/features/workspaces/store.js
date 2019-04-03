import {
  computed,
  observable,
  action,
} from 'mobx';
import { matchRoute } from '../../helpers/routing-helpers';
import { workspaceActions } from './actions';
import { FeatureStore } from '../utils/FeatureStore';
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  getUserWorkspacesRequest,
  updateWorkspaceRequest,
} from './api';

const debug = require('debug')('Franz:feature:workspaces:store');

export default class WorkspacesStore extends FeatureStore {
  @observable isFeatureEnabled = false;

  @observable isPremiumFeature = true;

  @observable isFeatureActive = false;

  @observable activeWorkspace = null;

  @observable nextWorkspace = null;

  @observable workspaceBeingEdited = null;

  @observable isSwitchingWorkspace = false;

  @observable isWorkspaceDrawerOpen = false;

  @computed get workspaces() {
    if (!this.isFeatureActive) return [];
    return getUserWorkspacesRequest.result || [];
  }

  @computed get isPremiumUpgradeRequired() {
    return this.isFeatureEnabled && !this.isFeatureActive;
  }

  start(stores, actions) {
    debug('WorkspacesStore::start');
    this.stores = stores;
    this.actions = actions;

    this._listenToActions([
      [workspaceActions.edit, this._edit],
      [workspaceActions.create, this._create],
      [workspaceActions.delete, this._delete],
      [workspaceActions.update, this._update],
      [workspaceActions.activate, this._setActiveWorkspace],
      [workspaceActions.deactivate, this._deactivateActiveWorkspace],
      [workspaceActions.toggleWorkspaceDrawer, this._toggleWorkspaceDrawer],
      [workspaceActions.openWorkspaceSettings, this._openWorkspaceSettings],
    ]);

    this._startReactions([
      this._setWorkspaceBeingEditedReaction,
      this._setActiveServiceOnWorkspaceSwitchReaction,
      this._setFeatureEnabledReaction,
      this._setIsPremiumFeatureReaction,
    ]);

    getUserWorkspacesRequest.execute();
    this.isFeatureActive = true;
  }

  stop() {
    debug('WorkspacesStore::stop');
    this.isFeatureActive = false;
    this.activeWorkspace = null;
    this.nextWorkspace = null;
    this.workspaceBeingEdited = null;
    this.isSwitchingWorkspace = false;
    this.isWorkspaceDrawerOpen = false;
  }

  filterServicesByActiveWorkspace = (services) => {
    const { activeWorkspace, isFeatureActive } = this;

    if (!isFeatureActive) return services;
    if (activeWorkspace) {
      return services.filter(s => (
        activeWorkspace.services.includes(s.id)
      ));
    }
    return services;
  };

  // ========== PRIVATE ========= //

  _getWorkspaceById = id => this.workspaces.find(w => w.id === id);

  // Actions

  @action _edit = ({ workspace }) => {
    this.stores.router.push(`/settings/workspaces/edit/${workspace.id}`);
  };

  @action _create = async ({ name }) => {
    try {
      const workspace = await createWorkspaceRequest.execute(name);
      await getUserWorkspacesRequest.result.push(workspace);
      this._edit({ workspace });
    } catch (error) {
      throw error;
    }
  };

  @action _delete = async ({ workspace }) => {
    try {
      await deleteWorkspaceRequest.execute(workspace);
      await getUserWorkspacesRequest.result.remove(workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  @action _update = async ({ workspace }) => {
    try {
      await updateWorkspaceRequest.execute(workspace);
      // Path local result optimistically
      const localWorkspace = this._getWorkspaceById(workspace.id);
      Object.assign(localWorkspace, workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  @action _setActiveWorkspace = ({ workspace }) => {
    // Indicate that we are switching to another workspace
    this.isSwitchingWorkspace = true;
    this.nextWorkspace = workspace;
    // Delay switching to next workspace so that the services loading does not drag down UI
    setTimeout(() => { this.activeWorkspace = workspace; }, 100);
    // Indicate that we are done switching to the next workspace
    setTimeout(() => {
      this.isSwitchingWorkspace = false;
      this.nextWorkspace = null;
    }, 1000);
  };

  @action _deactivateActiveWorkspace = () => {
    // Indicate that we are switching to default workspace
    this.isSwitchingWorkspace = true;
    this.nextWorkspace = null;
    // Delay switching to next workspace so that the services loading does not drag down UI
    setTimeout(() => { this.activeWorkspace = null; }, 100);
    // Indicate that we are done switching to the default workspace
    setTimeout(() => { this.isSwitchingWorkspace = false; }, 1000);
  };

  @action _toggleWorkspaceDrawer = () => {
    this.isWorkspaceDrawerOpen = !this.isWorkspaceDrawerOpen;
  };

  @action _openWorkspaceSettings = () => {
    this.actions.ui.openSettings({ path: 'workspaces' });
  };

  // Reactions

  _setFeatureEnabledReaction = () => {
    const { isWorkspaceEnabled } = this.stores.features.features;
    this.isFeatureEnabled = isWorkspaceEnabled;
  };

  _setIsPremiumFeatureReaction = () => {
    const { isWorkspacePremiumFeature } = this.stores.features.features;
    this.isPremiumFeature = isWorkspacePremiumFeature;
  };

  _setWorkspaceBeingEditedReaction = () => {
    const { pathname } = this.stores.router.location;
    const match = matchRoute('/settings/workspaces/edit/:id', pathname);
    if (match) {
      this.workspaceBeingEdited = this._getWorkspaceById(match.id);
    }
  };

  _setActiveServiceOnWorkspaceSwitchReaction = () => {
    if (!this.isFeatureActive) return;
    if (this.activeWorkspace) {
      const services = this.stores.services.allDisplayed;
      const activeService = services.find(s => s.isActive);
      const workspaceServices = this.filterServicesByActiveWorkspace(services);
      const isActiveServiceInWorkspace = workspaceServices.includes(activeService);
      if (!isActiveServiceInWorkspace) {
        this.actions.service.setActive({ serviceId: workspaceServices[0].id });
      }
    }
  };
}
