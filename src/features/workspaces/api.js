import { pick } from 'lodash';
import { sendAuthRequest } from '../../api/utils/auth';
import { API, API_VERSION } from '../../environment';
import Request from '../../stores/lib/Request';
import Workspace from './models/Workspace';

const debug = require('debug')('Franz:feature:workspaces:api');

export const workspaceApi = {
  getUserWorkspaces: async () => {
    const url = `${API}/${API_VERSION}/workspace`;
    debug('getUserWorkspaces GET', url);
    const result = await sendAuthRequest(url, { method: 'GET' });
    debug('getUserWorkspaces RESULT', result);
    if (!result.ok) throw result;
    const workspaces = await result.json();
    return workspaces.map(data => new Workspace(data));
  },

  createWorkspace: async (name) => {
    const url = `${API}/${API_VERSION}/workspace`;
    const options = {
      method: 'POST',
      body: JSON.stringify({ name }),
    };
    debug('createWorkspace POST', url, options);
    const result = await sendAuthRequest(url, options);
    debug('createWorkspace RESULT', result);
    if (!result.ok) throw result;
    return new Workspace(await result.json());
  },

  deleteWorkspace: async (workspace) => {
    const url = `${API}/${API_VERSION}/workspace/${workspace.id}`;
    debug('deleteWorkspace DELETE', url);
    const result = await sendAuthRequest(url, { method: 'DELETE' });
    debug('deleteWorkspace RESULT', result);
    if (!result.ok) throw result;
    return true;
  },

  updateWorkspace: async (workspace) => {
    const url = `${API}/${API_VERSION}/workspace/${workspace.id}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(pick(workspace, ['name', 'services'])),
    };
    debug('updateWorkspace UPDATE', url, options);
    const result = await sendAuthRequest(url, options);
    debug('updateWorkspace RESULT', result);
    if (!result.ok) throw result;
    return new Workspace(await result.json());
  },
};

export const getUserWorkspacesRequest = new Request(workspaceApi, 'getUserWorkspaces');
export const createWorkspaceRequest = new Request(workspaceApi, 'createWorkspace');
export const deleteWorkspaceRequest = new Request(workspaceApi, 'deleteWorkspace');
export const updateWorkspaceRequest = new Request(workspaceApi, 'updateWorkspace');

export const resetApiRequests = () => {
  getUserWorkspacesRequest.reset();
  createWorkspaceRequest.reset();
  deleteWorkspaceRequest.reset();
  updateWorkspaceRequest.reset();
};
