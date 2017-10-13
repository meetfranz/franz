import { app, ipcMain, Tray, Menu } from 'electron';
import path from 'path';

const INDICATOR_TRAY_PLAIN = 'tray';
const INDICATOR_TRAY_UNREAD = 'tray-unread';
const INDICATOR_TASKBAR = 'taskbar';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';
let trayIcon;

function getAsset(type, asset) {
  return path.join(
    __dirname, '..', '..', 'assets', 'images', type, process.platform, `${asset}.${FILE_EXTENSION}`,
  );
}

export default (params) => {
  trayIcon = new Tray(getAsset('tray', INDICATOR_TRAY_PLAIN));
  const trayMenuTemplate = [
    {
      label: 'Show Franz',
      click() {
        params.mainWindow.show();
      },
    }, {
      label: 'Quit Franz',
      click() {
        app.quit();
      },
    },
  ];

  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setContextMenu(trayMenu);

  trayIcon.on('click', () => {
    params.mainWindow.show();
  });

  ipcMain.on('updateAppIndicator', (event, args) => {
    // Update badge
    if (process.platform === 'darwin'
      && typeof (args.indicator) === 'string') {
      app.dock.setBadge(args.indicator);
    }

    if ((process.platform === 'darwin'
      || process.platform === 'linux')
      && typeof (args.indicator) === 'number'
    ) {
      app.setBadgeCount(args.indicator);
    }

    if (process.platform === 'win32') {
      if (typeof args.indicator === 'number'
        && args.indicator !== 0) {
        params.mainWindow.setOverlayIcon(
          getAsset('taskbar', `${INDICATOR_TASKBAR}-${(args.indicator >= 10 ? 10 : args.indicator)}`),
          '',
        );
      } else if (typeof args.indicator === 'string') {
        params.mainWindow.setOverlayIcon(
          getAsset('taskbar', `${INDICATOR_TASKBAR}-alert`),
          '',
        );
      } else {
        params.mainWindow.setOverlayIcon(null, '');
      }
    }

    // Update system tray
    trayIcon.setImage(getAsset('tray', args.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN));

    if (process.platform === 'darwin') {
      trayIcon.setPressedImage(
        getAsset('tray', `${args.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN}-active`),
      );
    }
  });
};
