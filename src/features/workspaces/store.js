import { observable, reaction } from 'mobx';
import Store from '../../stores/lib/Store';
import CachedRequest from '../../stores/lib/CachedRequest';

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
      workspaces => this.setWorkspaces(workspaces),
    );
  }

  setWorkspaces = (workspaces) => {
    debug('setting user workspaces', workspaces.slice());
    this.state.workspaces = workspaces;
  };
}
