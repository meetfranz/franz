import {
  computed,
  observable,
  action,
} from 'mobx';
import Reaction from '../../stores/lib/Reaction';
import { matchRoute } from '../../helpers/routing-helpers';
import { workspaceActions } from './actions';
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  getUserWorkspacesRequest,
  updateWorkspaceRequest,
} from './api';

const debug = require('debug')('Franz:feature:workspaces:store');

export default class WorkspacesStore {
  @observable isFeatureActive = false;

  @observable activeWorkspace = null;

  @observable nextWorkspace = null;

  @observable workspaceBeingEdited = null;

  @observable isSwitchingWorkspace = false;

  @observable isWorkspaceDrawerOpen = false;

  @computed get workspaces() {
    return getUserWorkspacesRequest.execute().result || [];
  }

  constructor() {
    // Wire-up action handlers
    workspaceActions.edit.listen(this._edit);
    workspaceActions.create.listen(this._create);
    workspaceActions.delete.listen(this._delete);
    workspaceActions.update.listen(this._update);
    workspaceActions.activate.listen(this._setActiveWorkspace);
    workspaceActions.deactivate.listen(this._deactivateActiveWorkspace);
    workspaceActions.toggleWorkspaceDrawer.listen(this._toggleWorkspaceDrawer);
    workspaceActions.openWorkspaceSettings.listen(this._openWorkspaceSettings);

    // Register and start reactions
    this._registerReactions([
      this._updateWorkspaceBeingEdited,
      this._updateActiveServiceOnWorkspaceSwitch,
    ]);
  }

  start(stores, actions) {
    debug('WorkspacesStore::start');
    this.stores = stores;
    this.actions = actions;
    this._reactions.forEach(r => r.start());
    this.isFeatureActive = true;
  }

  stop() {
    debug('WorkspacesStore::stop');
    this._reactions.forEach(r => r.stop());
    this.isFeatureActive = false;
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

  _reactions = [];

  _registerReactions(reactions) {
    reactions.forEach(r => this._reactions.push(new Reaction(r)));
  }

  _getWorkspaceById = id => this.workspaces.find(w => w.id === id);

  // Actions

  @action _edit = ({ workspace }) => {
    this.stores.router.push(`/settings/workspaces/edit/${workspace.id}`);
  };

  @action _create = async ({ name }) => {
    try {
      const workspace = await createWorkspaceRequest.execute(name);
      await getUserWorkspacesRequest.patch((result) => {
        result.push(workspace);
      });
      this._edit({ workspace });
    } catch (error) {
      throw error;
    }
  };

  @action _delete = async ({ workspace }) => {
    try {
      await deleteWorkspaceRequest.execute(workspace);
      await getUserWorkspacesRequest.patch((result) => {
        result.remove(workspace);
      });
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  @action _update = async ({ workspace }) => {
    try {
      await updateWorkspaceRequest.execute(workspace);
      await getUserWorkspacesRequest.patch((result) => {
        const localWorkspace = result.find(ws => ws.id === workspace.id);
        Object.assign(localWorkspace, workspace);
      });
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

  _updateWorkspaceBeingEdited = () => {
    const { pathname } = this.stores.router.location;
    const match = matchRoute('/settings/workspaces/edit/:id', pathname);
    if (match) {
      this.workspaceBeingEdited = this._getWorkspaceById(match.id);
    }
  };

  _updateActiveServiceOnWorkspaceSwitch = () => {
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
