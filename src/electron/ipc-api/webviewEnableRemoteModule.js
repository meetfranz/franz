import { ipcMain, webContents } from 'electron';
import * as remoteMain from '@electron/remote/main';

const debug = require('debug')('Franz:ipcApi:webviewEnableRemoteModule');

export default async () => {
  ipcMain.on('enableWebviewRemoteModule', (event, { id }) => {
    try {
      debug('Enabling remote module for webContents:', id);
      const webviewWebContents = webContents.fromId(id);
      remoteMain.enable(webviewWebContents);
    } catch (e) {
      console.error(e);
    }
  });
};
