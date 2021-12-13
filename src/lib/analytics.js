import { app } from '@electron/remote';
// import querystring from 'querystring';

// import { STATS_API } from '../config';
// import { isDevMode, GA_ID } from '../environment';

const debug = require('debug')('Franz:Analytics');

/* eslint-disable */
const _paq = window._paq = window._paq || [];

_paq.push(['setCustomDimension', 1, app.getVersion()]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);

(function() {
  const u="https:////analytics.franzinfra.com/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '1']);
  const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
/* eslint-enable */

// const GA_LOCAL_STORAGE_KEY = 'gaUid';

// ga((tracker) => {
//   localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get('clientId'));
// });
// ga('set', 'checkProtocolTask', null);
// ga('set', 'version', app.getVersion());

// ga('send', 'App');

export function gaPage(page) {
  _paq.push(['trackPageView']);
  debug('GA track page', page);
}

export function gaEvent(category, action, label) {
  // ga('send', 'event', category, action, label);
  _paq.push(['trackEvent', category, action, label]);
  debug('GA track event', category, action, label);
}
