import { ipcRenderer } from 'electron';

import BasicAuthComponent from './Component';

const debug = require('debug')('Franz:feature:basicAuth');

export default function initialize() {
  debug('Initialize basicAuth feature');
}

export function sendCredentials(user, password) {
  debug('Sending credentials to main', user, password);

  ipcRenderer.send('feature-basic-auth-credentials', {
    user,
    password,
  });
}

export function cancelLogin() {
  debug('Cancel basic auth event');

  ipcRenderer.send('feature-basic-auth-cancel');
}

export const Component = BasicAuthComponent;
