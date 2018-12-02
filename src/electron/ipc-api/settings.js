import { ipcMain } from 'electron';

export default (params) => {
  ipcMain.on('getAppSettings', (event, type) => {
    console.log('getAppSettings', type, params.settings[type].all);
    params.mainWindow.webContents.send('appSettings', {
      type,
      data: params.settings[type].all,
    });
  });

  ipcMain.on('updateAppSettings', (event, args) => {
    params.settings[args.type].set(args.data);
  });
};
