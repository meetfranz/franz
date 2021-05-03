import { ipcMain } from 'electron';
import { execSync } from 'child_process';
import { isMac } from '../../environment';

const debug = require('debug')('Franz:ipcApi:dnd');

export default async () => {
  ipcMain.handle('get-dnd', async () => {
    try {
      if (!isMac) {
        debug('Not on macOS, returning', false);
      }

      try {
        const dndQueryResponse = execSync('defaults read com.apple.controlcenter "NSStatusItem Visible DoNotDisturb"');
        const isDND = Buffer.from(dndQueryResponse).toString().trim() === '1';

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
