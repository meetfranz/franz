import { observable, reaction, action } from 'mobx';
import Store from '../../stores/lib/Store';
import CachedRequest from '../../stores/lib/CachedRequest';
import Workspace from './models/Workspace';
import { matchRoute } from '../../helpers/routing-helpers';
import { workspaceActions } from './actions';

const debug = require('debug')('Franz:feature:workspaces');

export default class WorkspacesStore extends Store {
  @observable allWorkspacesRequest = new CachedRequest(this.api, 'getUserWorkspaces');

  constructor(stores, api, actions, state) {
    super(stores, api, actions);
    this.state = state;
  }

  setup() {
    debug('fetching workspaces');
    this.allWorkspacesRequest.execute();

    /**
     * Update the state workspaces array when workspaces request has results.
     */
    reaction(
      () => this.allWorkspacesRequest.result,
      workspaces => this._setWorkspaces(workspaces),
    );
    /**
     * Update the loading state when workspace request is executing.
     */
    reaction(
      () => this.allWorkspacesRequest.isExecuting,
      isExecuting => this._setIsLoading(isExecuting),
    );
    /**
     * Update the state with the workspace to be edited when route matches.
     */
    reaction(
      () => ({
        pathname: this.stores.router.location.pathname,
        workspaces: this.state.workspaces,
      }),
      ({ pathname }) => {
        const match = matchRoute('/settings/workspaces/edit/:id', pathname);
        if (match) {
          this.state.workspaceBeingEdited = this._getWorkspaceById(match.id);
        }
      },
    );

    workspaceActions.edit.listen(this._edit);
    workspaceActions.create.listen(this._create);
    workspaceActions.delete.listen(this._delete);
    workspaceActions.update.listen(this._update);
    workspaceActions.activate.listen(this._setActiveWorkspace);
    workspaceActions.deactivate.listen(this._deactivateActiveWorkspace);
    workspaceActions.toggleWorkspaceDrawer.listen(this._toggleWorkspaceDrawer);
    workspaceActions.openWorkspaceSettings.listen(this._openWorkspaceSettings);
  }

  _getWorkspaceById = id => this.state.workspaces.find(w => w.id === id);

  @action _setWorkspaces = (workspaces) => {
    debug('setting user workspaces', workspaces.slice());
    this.state.workspaces = workspaces.map(data => new Workspace(data));
  };

  @action _setIsLoading = (isLoading) => {
    this.state.isLoading = isLoading;
  };

  @action _edit = ({ workspace }) => {
    this.stores.router.push(`/settings/workspaces/edit/${workspace.id}`);
  };

  @action _create = async ({ name }) => {
    try {
      const result = await this.api.createWorkspace(name);
      const workspace = new Workspace(result);
      this.state.workspaces.push(workspace);
      this._edit({ workspace });
    } catch (error) {
      throw error;
    }
  };

  @action _delete = async ({ workspace }) => {
    try {
      await this.api.deleteWorkspace(workspace);
      this.state.workspaces.remove(workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  @action _update = async ({ workspace }) => {
    try {
      await this.api.updateWorkspace(workspace);
      const localWorkspace = this.state.workspaces.find(ws => ws.id === workspace.id);
      Object.assign(localWorkspace, workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  @action _setActiveWorkspace = ({ workspace }) => {
    this.state.activeWorkspace = workspace;
  };

  @action _deactivateActiveWorkspace = () => {
    this.state.activeWorkspace = null;
  };

  @action _toggleWorkspaceDrawer = () => {
    this.state.isWorkspaceDrawerOpen = !this.state.isWorkspaceDrawerOpen;
  };

  @action _openWorkspaceSettings = () => {
    this.actions.ui.openSettings({ path: 'workspaces' });
  };
}
