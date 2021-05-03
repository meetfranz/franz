import { ipcMain } from 'electron';
import { getDoNotDisturb } from 'macos-notification-state';

const debug = require('debug')('Franz:ipcApi:dnd');

export default async () => {
  ipcMain.handle('get-dnd', async () => {
    try {
      const isDND = getDoNotDisturb();
      debug('Fetching DND state, set to', isDND);
      return isDND;
    } catch (e) {
      console.error(e);
    }
  });
};
