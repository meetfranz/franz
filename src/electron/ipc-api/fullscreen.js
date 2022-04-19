import { ipcMain } from "electron";
import { TOGGLE_FULL_SCREEN } from "../../ipcChannels";

export const UPDATE_FULL_SCREEN_STATUS = 'set-full-screen-status';

export default ({ mainWindow }) => {
  ipcMain.on(TOGGLE_FULL_SCREEN, (e) => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  })

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send(UPDATE_FULL_SCREEN_STATUS, true);
  });
  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send(UPDATE_FULL_SCREEN_STATUS, false);
  });
};
