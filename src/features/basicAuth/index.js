import { ipcRenderer } from 'electron';
import { observable } from 'mobx';

import BasicAuthComponent from './Component';

const debug = require('debug')('Franz:feature:basicAuth');

const defaultState = {
  isModalVisible: true,
  service: null,
  authInfo: null,
};

export const state = observable(defaultState);

export function resetState() {
  Object.assign(state, defaultState);
}

export default function initialize() {
  debug('Initialize basicAuth feature');

  window.franz.features.basicAuth = {
    state,
  };

  ipcRenderer.on('feature:basic-auth-request', (e, data) => {
    debug(e, data);
    // state.serviceId = data.serviceId;
    state.authInfo = data.authInfo;
    state.isModalVisible = true;
  });
}

export function mainIpcHandler(mainWindow, authInfo) {
  debug('Sending basic auth call', authInfo);

  mainWindow.webContents.send('feature:basic-auth-request', {
    authInfo,
  });
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
