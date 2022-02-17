import { ipcMain } from 'electron';

const debug = require('debug')('Franz:ipcApi:serviceCache');

export default () => {
  ipcMain.handle('clearServiceCache', ({ sender: webContents }) => {
    debug('Clearing cache for service');
    const { session } = webContents;

    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });
  });
};
