import { app } from '@electron/remote';
import ElectronCookies from '@meetfranz/electron-cookies';
// import querystring from 'querystring';

// import { STATS_API } from '../config';
// import { isDevMode, GA_ID } from '../environment';

ElectronCookies.enable({
  origin: 'https://app.meetfranz.com',
});

const debug = require('debug')('Franz:Analytics');

/* eslint-disable */
var _paq = window._paq = window._paq || [];

_paq.push(["setCookieDomain", "app.meetfranz.com"]); 	
_paq.push(['setCustomDimension', 1, app.getVersion()]);
_paq.push(['setDomains', 'app.meetfranz.com']);
_paq.push(['setCustomUrl', '/']);
_paq.push(['trackPageView']);


(function() {
  var u="https://analytics.franzinfra.com/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '1']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
/* eslint-enable */

export function gaPage(page) {
  window._paq.push(['setCustomUrl', page]);
  window._paq.push(['trackPageView']);

  debug('Track page', page);
}

export function gaEvent(category, action, label) {
  window._paq.push(['trackEvent', category, action, label]);
  debug('Track event', category, action, label);
}
