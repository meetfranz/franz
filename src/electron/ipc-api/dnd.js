import { ipcMain } from 'electron';
import { isMac } from '../../environment';

const debug = require('debug')('Franz:ipcApi:dnd');

export default async () => {
  ipcMain.handle('get-dnd', async () => {
    try {
      if (!isMac) {
        debug('Not on macOS, returning', false);
        return false;
      }

      try {
        // eslint-disable-next-line global-require
        const { getNotificationState } = require('@meetfranz/macos-notification-state');

        const state = getNotificationState();

        const isDND = state === 'DO_NOT_DISTURB';

        debug('Fetching DND state, set to', isDND);
        return isDND;
      } catch (err) {
        console.log(err);

        return false;
      }
    } catch (e) {
      console.error(e);
    }
  });
};
