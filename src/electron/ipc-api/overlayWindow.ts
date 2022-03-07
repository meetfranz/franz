import { BrowserWindow, ipcMain } from 'electron';
// eslint-disable-next-line import/no-named-default
import { isDevMode, isLinux, isMac } from '../../environment';
import { OPEN_OVERLAY } from '../../ipcChannels';

const debug = require('debug')('Franz:ipcApi:overlayWindow');

interface IArgs {
  route: string;
  width?: number;
  height?: number;
  transparent?: boolean;
  modal?: boolean;
}

export const UPDATE_FULL_SCREEN_STATUS = 'set-full-screen-status';

export default ({ mainWindow }: { mainWindow: BrowserWindow}) => {
  ipcMain.handle(OPEN_OVERLAY, (event, args: IArgs) => {
    debug('Got overlay window open request', args);

    const window = new BrowserWindow({
    // x: posX,
    // y: posY,
      width: args.width ?? 800,
      height: args.height ?? 600,
      // minWidth: 600,
      // minHeight: 500,
      titleBarStyle: isMac ? 'hidden' : 'default',
      frame: isLinux,
      transparent: args.transparent || false,
      modal: args.modal ?? false,
      parent: args.modal ? mainWindow : null,
      // backgroundColor: !settings.get('darkMode') ? '#3498db' : '#1E1E1E',
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        contextIsolation: false,
      },
    });

    // eslint-disable-next-line global-require
    require('@electron/remote/main').enable(window.webContents);

    window.once('ready-to-show', () => {
      window.show();
      window.webContents.focus();

      if (isDevMode) {
        window.webContents.openDevTools();
      }
    });

    window.loadFile('overlay.html', {
      hash: args.route,
    });
  });
};
