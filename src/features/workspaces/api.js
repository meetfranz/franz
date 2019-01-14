import { prepareAuthRequest } from '../../api/utils/auth';
import { API, API_VERSION } from '../../environment';

export default {
  getUserWorkspaces: async () => {
    const url = `${API}/${API_VERSION}/workspace`;
    const request = await window.fetch(url, prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) throw request;
    return request.json();
  },
};
