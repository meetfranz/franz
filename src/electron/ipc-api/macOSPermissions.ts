import { BrowserWindow, ipcMain } from 'electron';
import { isMac } from '../../environment';
import { CHECK_MACOS_PERMISSIONS } from '../../ipcChannels';

export default ({ mainWindow }: { mainWindow: BrowserWindow }) => {
  // workaround to not break app on non macOS systems
  if (isMac) {
    ipcMain.on(CHECK_MACOS_PERMISSIONS, () => {
      // eslint-disable-next-line global-require
      const { default: askFormacOSPermissions } = require('../macOSPermissions');
      askFormacOSPermissions(mainWindow);
    });
  }
};
