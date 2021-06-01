// import Request from '../../stores/lib/Request';
import { API, API_VERSION } from '../../environment';
import { sendAuthRequest } from '../../api/utils/auth';
import CachedRequest from '../../stores/lib/CachedRequest';


const debug = require('debug')('Franz:feature:delayApp:api');

export const delayAppApi = {
  async getPoweredBy() {
    debug('fetching release changelog from Github');
    const url = `${API}/${API_VERSION}/poweredby`;
    const response = await sendAuthRequest(url, {
      method: 'GET',
    });

    if (!response.ok) return null;
    return response.json();
  },
};

export const getPoweredByRequest = new CachedRequest(delayAppApi, 'getPoweredBy');
