import { ipcRenderer } from 'electron';

const debug = require('debug')('Franz:feature:todos:preload');

debug('Preloading Todos Webview');

let hostMessageListener = () => {};

window.franz = {
  onInitialize(ipcHostMessageListener) {
    hostMessageListener = ipcHostMessageListener;
  },
  sendToHost(message) {
    ipcRenderer.sendToHost('clientMessage', message);
  },
};

ipcRenderer.on('hostMessage', (event, message) => {
  debug('Received host message', event, message);
  hostMessageListener(message);
});
