import { ipcMain } from 'electron';

export default (params) => {
  if (process.platform === 'darwin' || process.platform === 'win32') {
    // eslint-disable-next-line
    ipcMain.on('settings', (event, args) => {
      params.settings.set(args);
    });
  }
};
