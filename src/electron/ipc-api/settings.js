import { ipcMain } from 'electron';
import { GET_SETTINGS, SEND_SETTINGS } from '../../ipcChannels';

export default (params) => {
  ipcMain.on(GET_SETTINGS, (event, type) => {
    event.sender.send(SEND_SETTINGS, {
      type,
      data: params.settings[type]?.allSerialized,
    });
  });

  ipcMain.on('updateAppSettings', (event, args) => {
    params.settings[args.type].set(args.data);
  });
};
