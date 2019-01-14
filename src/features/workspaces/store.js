import { observable, reaction } from 'mobx';
import Store from '../../stores/lib/Store';
import CachedRequest from '../../stores/lib/CachedRequest';
import Workspace from '../../models/Workspace';

const debug = require('debug')('Franz:feature:workspaces');

export default class WorkspacesStore extends Store {
  @observable allWorkspacesRequest = new CachedRequest(this.api, 'getUserWorkspaces');

  constructor(stores, api, actions, state) {
    super(stores, api, actions);
    this.state = state;
  }

  setup() {
    debug('fetching user workspaces');
    this.allWorkspacesRequest.execute();

    reaction(
      () => this.allWorkspacesRequest.result,
      workspaces => this._setWorkspaces(workspaces),
    );
    reaction(
      () => this.allWorkspacesRequest.isExecuting,
      isExecuting => this._setIsLoading(isExecuting),
    );
  }

  _setWorkspaces = (workspaces) => {
    debug('setting user workspaces', workspaces.slice());
    this.state.workspaces = workspaces.map(data => new Workspace(data));
  };

  _setIsLoading = (isLoading) => {
    this.state.isLoading = isLoading;
  };
}
