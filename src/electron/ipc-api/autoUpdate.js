import { BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { appEvents } from '../..';

const debug = require('debug')('Franz:ipcApi:autoUpdate');

export default ({ mainWindow, settings }) => {
  if (process.platform === 'darwin' || process.platform === 'win32' || process.env.APPIMAGE) {
    ipcMain.on('autoUpdate', (event, args) => {
      try {
        autoUpdater.autoInstallOnAppQuit = false;
        autoUpdater.allowPrerelease = Boolean(settings.app.get('beta'));
        if (args.action === 'check') {
          autoUpdater.checkForUpdates();
        } else if (args.action === 'install') {
          debug('install update');
          appEvents.emit('install-update');

          const openedWindows = BrowserWindow.getAllWindows();
          openedWindows.forEach(window => window.close());

          autoUpdater.quitAndInstall();
        }
      } catch (e) {
        console.log(e);
      }
    });

    autoUpdater.on('update-not-available', () => {
      debug('update-not-available');
      mainWindow.webContents.send('autoUpdate', { available: false });
    });

    autoUpdater.on('update-available', (event) => {
      debug('update-available');
      mainWindow.webContents.send('autoUpdate', {
        version: event.version,
        available: true,
      });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;

      debug(logMessage);
    });

    autoUpdater.on('update-downloaded', () => {
      debug('update-downloaded');
      mainWindow.webContents.send('autoUpdate', { downloaded: true });
    });

    autoUpdater.on('error', () => {
      debug('update-error');
      mainWindow.webContents.send('autoUpdate', { error: true });
    });
  }
};
