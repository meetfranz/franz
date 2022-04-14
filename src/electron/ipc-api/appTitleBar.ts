import { BrowserWindow, ipcMain } from 'electron';
import { APP_TITLE_BAR_GET_STATUS, APP_TITLE_BAR_MAXIMIZE_APP, APP_TITLE_BAR_MINIMIZE_APP } from '../../ipcChannels';

export default async ({ mainWindow }: { mainWindow: BrowserWindow }) => {
  function updateStatus() {
    mainWindow.webContents.send(APP_TITLE_BAR_GET_STATUS, {
      isMaximizable: mainWindow.isMaximizable(),
      isMaximized: mainWindow.isMaximized(),
      isMinimizeable: mainWindow.isMinimizable(),
    });
  }

  ipcMain.on(APP_TITLE_BAR_GET_STATUS, () => {
    updateStatus();
  });

  ipcMain.on(APP_TITLE_BAR_MAXIMIZE_APP, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on(APP_TITLE_BAR_MINIMIZE_APP, () => {
    mainWindow.minimize();
  });

  mainWindow.on('maximize', () => updateStatus());
  mainWindow.on('minimize', () => updateStatus());
};
