import { observable, reaction } from 'mobx';
import Store from '../../stores/lib/Store';
import CachedRequest from '../../stores/lib/CachedRequest';
import Workspace from './models/Workspace';
import { matchRoute } from '../../helpers/routing-helpers';

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

    this.actions.workspace.edit.listen(this._edit);
    this.actions.workspace.create.listen(this._create);
    this.actions.workspace.delete.listen(this._delete);
    this.actions.workspace.update.listen(this._update);
  }

  _setWorkspaces = (workspaces) => {
    debug('setting user workspaces', workspaces.slice());
    this.state.workspaces = workspaces.map(data => new Workspace(data));
  };

  _setIsLoading = (isLoading) => {
    this.state.isLoading = isLoading;
  };

  _getWorkspaceById = id => this.state.workspaces.find(w => w.id === id);

  _edit = ({ workspace }) => {
    this.stores.router.push(`/settings/workspaces/edit/${workspace.id}`);
  };

  _create = async ({ name }) => {
    try {
      const result = await this.api.createWorkspace(name);
      const workspace = new Workspace(result);
      this.state.workspaces.push(workspace);
      this._edit({ workspace });
    } catch (error) {
      throw error;
    }
  };

  _delete = async ({ workspace }) => {
    try {
      await this.api.deleteWorkspace(workspace);
      this.state.workspaces.remove(workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };

  _update = async ({ workspace }) => {
    try {
      await this.api.updateWorkspace(workspace);
      const localWorkspace = this.state.workspaces.find(ws => ws.id === workspace.id);
      Object.assign(localWorkspace, workspace);
      this.stores.router.push('/settings/workspaces');
    } catch (error) {
      throw error;
    }
  };
}
