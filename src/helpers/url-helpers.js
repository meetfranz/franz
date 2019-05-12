import { URL } from 'url';

import { ALLOWED_PROTOCOLS } from '../config';

const debug = require('debug')('Franz:Helpers:url');

export function isValidExternalURL(url) {
  const parsedUrl = new URL(url);

  const isAllowed = ALLOWED_PROTOCOLS.includes(parsedUrl.protocol);

  debug('protocol check is', isAllowed, 'for:', url);

  return isAllowed;
}
