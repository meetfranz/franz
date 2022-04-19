import { ipcRenderer } from 'electron';
// import { DEFAULT_WEB_CONTENTS_ID } from '../../config';
import { IPC } from './constants';

const debug = require('debug')('Franz:feature:todos:preload');

debug('Preloading Todos Webview');

let hostMessageListener = ({ action }) => {
  switch (action) {
    case 'todos:initialize-as-service': ipcRenderer.send('hello'); break;
    default:
  }
};

ipcRenderer.send('hello');

// ipcRenderer.on('initialize-recipe', () => {
//   // ipcRenderer.sendTo(1, IPC.TODOS_HOST_CHANNEL, { action: 'todos:initialized' });
// });

window.franz = {
  onInitialize(ipcHostMessageListener) {
    hostMessageListener = ipcHostMessageListener;
    ipcRenderer.sendTo(1, IPC.TODOS_CLIENT_CHANNEL, { action: 'todos:initialized' });
  },
  sendToHost(message) {
    console.log('send to host', message);
    ipcRenderer.sendTo(1, IPC.TODOS_CLIENT_CHANNEL, message);
  },
};

ipcRenderer.on(IPC.TODOS_HOST_CHANNEL, (event, message) => {
  debug('Received host message', event, message);
  hostMessageListener(message);
});
