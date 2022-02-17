import { BrowserWindow, ipcMain } from 'electron';
import * as remoteMain from '@electron/remote/main';

const debug = require('debug')('Franz:ipcApi:subscriptionWindow');

export default async ({ mainWindow }) => {
  let subscriptionWindow;
  ipcMain.handle('open-inline-subscription-window', async (event, { url }) => {
    debug('Opening subscription window with url', url);
    try {
      const windowBounds = mainWindow.getBounds();

      subscriptionWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: '🔒 Franz Supporter License',
        width: 800,
        height: windowBounds.height - 100,
        maxWidth: 800,
        minWidth: 600,
        webPreferences: {
          nodeIntegration: true,
          webviewTag: true,
          enableRemoteModule: true,
          contextIsolation: false,
        },
      });

      remoteMain.enable(subscriptionWindow.webContents);

      subscriptionWindow.loadURL(`file://${__dirname}/../../index.html#/payment/${encodeURIComponent(url)}`);

      return await new Promise((resolve) => {
        subscriptionWindow.on('closed', () => resolve('closed'));
      });
      // return isDND;
    } catch (e) {
      console.error(e);
    }
  });
};
