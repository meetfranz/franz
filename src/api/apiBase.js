/**
 * Get API base URL from store
 */
import {
  API_VERSION,
  API,
} from '../environment';

const apiBase = () => {
  let url;

  if (!window.ferdi
    || !window.ferdi.stores.settings
    || !window.ferdi.stores.settings.all
    || !window.ferdi.stores.settings.all.app.server) {
    // Stores have not yet been loaded - send invalid URL to force a retry when stores are loaded
    //  "Why 1.1.1.1 as the default, invalid URL?"
    //    1.1.1.1 is the server for Cloudflare's DNS service and will be the same across most networks.
    //    Using a random IP could result in unwanted connections, using localhost could unwantedly
    //    connect to local develoment servers.
    //    1.1.1.1 also sends a status 400 response for invalid routes. Other servers may return status 401
    //    on some routes. This would result in Ferdi deleting its current authToken as it thinks it
    //    has gone invalid.
    url = 'https://1.1.1.1';
  } else {
    // Load URL from store
    url = window.ferdi.stores.settings.all.app.server;
  }

  return `${url}/${API_VERSION}`;
};

export default apiBase;
