/**
 * Get API base URL from store
 */
import {
  API_VERSION,
  API,
} from '../environment';

const apiBase = () => {
  let url;
  if (!window.ferdi.stores.settings || !window.ferdi.stores.settings.all) {
    // Stores have not yet been loaded - send invalid URL to force a retry when stores are loaded
    url = 'https://localhost:9999';
  } else if (window.ferdi.stores.settings.all.app.server) {
    // Load URL from store
    url = window.ferdi.stores.settings.all.app.server;
  } else {
    // Use default server url
    url = API;
  }

  return `${url}/${API_VERSION}`;
};

export default apiBase;
