import { ipcMain } from 'electron';

export default (params) => {
  ipcMain.on('settings', (event, args) => {
    params.settings.set(args);
  });
};
