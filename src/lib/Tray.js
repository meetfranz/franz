import {
  app, Tray, Menu, systemPreferences, nativeImage,
} from 'electron';
import path from 'path';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';
const INDICATOR_TRAY_PLAIN = 'tray';
const INDICATOR_TRAY_UNREAD = 'tray-unread';

export default class TrayIcon {
  trayIcon = null;

  indicator = 0;

  themeChangeSubscriberId = null;

  show() {
    if (this.trayIcon) return;

    this.trayIcon = new Tray(this._getAsset('tray', INDICATOR_TRAY_PLAIN));
    const trayMenuTemplate = [
      {
        label: 'Show Franz',
        click() {
          if (app.mainWindow.isMinimized()) {
            app.mainWindow.restore();
          }
          app.mainWindow.show();
          app.mainWindow.focus();
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
      if (app.mainWindow.isMinimized()) {
        app.mainWindow.restore();
      }
      app.mainWindow.show();
      app.mainWindow.focus();
    });

    if (process.platform === 'darwin') {
      this.themeChangeSubscriberId = systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
        this._refreshIcon();
      });
    }
  }

  hide() {
    if (!this.trayIcon) return;

    this.trayIcon.destroy();
    this.trayIcon = null;

    if (process.platform === 'darwin' && this.themeChangeSubscriberId) {
      systemPreferences.unsubscribeNotification(this.themeChangeSubscriberId);
      this.themeChangeSubscriberId = null;
    }
  }

  setIndicator(indicator) {
    this.indicator = indicator;
    this._refreshIcon();
  }

  _refreshIcon() {
    if (!this.trayIcon) return;

    this.trayIcon.setImage(this._getAsset('tray', this.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN));

    if (process.platform === 'darwin') {
      this.trayIcon.setPressedImage(
        this._getAsset('tray', `${this.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN}-active`),
      );
    }
  }

  _getAsset(type, asset) {
    let platform = process.platform;

    if (platform === 'darwin' && systemPreferences.isDarkMode()) {
      platform = `${platform}-dark`;
    }

    return nativeImage.createFromPath(path.join(
      __dirname, '..', 'assets', 'images', type, platform, `${asset}.${FILE_EXTENSION}`,
    ));
  }
}
