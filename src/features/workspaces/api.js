import { pick } from 'lodash';
import { sendAuthRequest } from '../../api/utils/auth';
import { API, API_VERSION } from '../../environment';

export default {
  getUserWorkspaces: async () => {
    const url = `${API}/${API_VERSION}/workspace`;
    const request = await sendAuthRequest(url, { method: 'GET' });
    if (!request.ok) throw request;
    return request.json();
  },

  createWorkspace: async (name) => {
    const url = `${API}/${API_VERSION}/workspace`;
    const request = await sendAuthRequest(url, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (!request.ok) throw request;
    return request.json();
  },

  deleteWorkspace: async (workspace) => {
    const url = `${API}/${API_VERSION}/workspace/${workspace.id}`;
    const request = await sendAuthRequest(url, { method: 'DELETE' });
    if (!request.ok) throw request;
    return request.json();
  },

  updateWorkspace: async (workspace) => {
    const url = `${API}/${API_VERSION}/workspace/${workspace.id}`;
    const request = await sendAuthRequest(url, {
      method: 'PUT',
      body: JSON.stringify(pick(workspace, ['name', 'services'])),
    });
    if (!request.ok) throw request;
    return request.json();
  },
};
