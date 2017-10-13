import { Tray, Menu, ipcMain } from 'electron';
import path from 'path';

const INDICATOR_PLAIN = 'franz-taskbar';
const INDICATOR_UNREAD = 'franz-taskbar-unread';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';

let trayIcon;

function getAsset(asset) {
  return path.join(
    __dirname, '..', '..', 'assets', 'images', 'tray', process.platform, `${asset}.${FILE_EXTENSION}`,
  );
}

export default (params) => {
  // if (process.platform === 'win32' || process.platform === 'linux') {
  trayIcon = new Tray(getAsset(INDICATOR_PLAIN));
  const trayMenuTemplate = [
    {
      label: 'Show Franz',
      click() {
        params.mainWindow.show();
      },
    }, {
      label: 'Quit Franz',
      click() {
        params.app.quit();
      },
    },
  ];

  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setContextMenu(trayMenu);

  trayIcon.on('click', () => {
    params.mainWindow.show();
  });

  ipcMain.on('updateTrayIconIndicator', (event, args) => {
    trayIcon.setImage(getAsset(args.count !== 0 ? INDICATOR_UNREAD : INDICATOR_PLAIN));

    if (process.platform === 'darwin') {
      trayIcon.setPressedImage(getAsset(`${args.count !== 0 ? INDICATOR_UNREAD : INDICATOR_PLAIN}-active`));
    }
  });
};
