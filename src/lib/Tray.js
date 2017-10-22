import { app, Tray, Menu } from 'electron';
import path from 'path';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';
const INDICATOR_TRAY_PLAIN = 'tray';
const INDICATOR_TRAY_UNREAD = 'tray-unread';

function getAsset(type, asset) {
  return path.join(
    __dirname, '..', 'assets', 'images', type, process.platform, `${asset}.${FILE_EXTENSION}`,
  );
}

export default class TrayIcon {
  mainWindow = null;
  trayIcon = null;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  show() {
    this.trayIcon = new Tray(getAsset('tray', INDICATOR_TRAY_PLAIN));
    const trayMenuTemplate = [
      {
        label: 'Show Franz',
        click() {
          this.mainWindow.show();
        },
      }, {
        label: 'Quit Franz',
        click() {
          app.quit();
        },
      },
    ];

    const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    this.trayIcon.setContextMenu(trayMenu);

    this.trayIcon.on('click', () => {
      this.mainWindow.show();
    });
  }

  hide() {
    if (this.trayIcon) {
      this.trayIcon.destroy();
      this.trayIcon = null;
    }
  }

  setIndicator(indicator) {
    if (!this.trayIcon) return;

    this.trayIcon.setImage(getAsset('tray', indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN));

    if (process.platform === 'darwin') {
      this.trayIcon.setPressedImage(
        getAsset('tray', `${indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN}-active`),
      );
    }
  }
}
