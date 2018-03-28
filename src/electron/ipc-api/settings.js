import { ipcMain } from 'electron';

export default (params) => {
  ipcMain.on('getAppSettings', () => {
    params.mainWindow.webContents.send('appSettings', params.settings.all);
  });

  ipcMain.on('updateAppSettings', (event, args) => {
    params.settings.set(args);
  });
};
