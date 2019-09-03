import { ipcRenderer } from 'electron';
import { IPC } from './constants';

const debug = require('debug')('Franz:feature:todos:preload');

debug('Preloading Todos Webview');

let hostMessageListener = () => {};

window.franz = {
  onInitialize(ipcHostMessageListener) {
    hostMessageListener = ipcHostMessageListener;
    ipcRenderer.sendToHost(IPC.TODOS_CLIENT_CHANNEL, { action: 'todos:initialized' });
  },
  sendToHost(message) {
    ipcRenderer.sendToHost(IPC.TODOS_CLIENT_CHANNEL, message);
  },
};

ipcRenderer.on(IPC.TODOS_HOST_CHANNEL, (event, message) => {
  debug('Received host message', event, message);
  hostMessageListener(message);
});
