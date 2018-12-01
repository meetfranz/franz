import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { isDevMode } from '../../environment.js';

export default (params) => {
  if (!isDevMode && (process.platform === 'darwin' || process.platform === 'win32')) {
    // autoUpdater.setFeedURL(updateUrl);
    ipcMain.on('autoUpdate', (event, args) => {
      try {
        autoUpdater.allowPrerelease = Boolean(params.settings.app.get('beta'));
        if (args.action === 'check') {
          autoUpdater.checkForUpdates();
        } else if (args.action === 'install') {
          console.log('install update');
          autoUpdater.quitAndInstall();
          // we need to send a quit event
          setTimeout(() => {
            app.quit();
          }, 20);
        }
      } catch (e) {
        console.error(e);
        event.sender.send('autoUpdate', { error: true });
      }
    });

    autoUpdater.on('update-not-available', () => {
      console.log('update-not-available');
      params.mainWindow.webContents.send('autoUpdate', { available: false });
    });

    autoUpdater.on('update-available', () => {
      console.log('update-available');
      params.mainWindow.webContents.send('autoUpdate', { available: true });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;

      console.log(logMessage);
    });

    autoUpdater.on('update-downloaded', () => {
      console.log('update-downloaded');
      params.mainWindow.webContents.send('autoUpdate', { downloaded: true });
    });

    autoUpdater.on('error', () => {
      console.log('update-error');
      params.mainWindow.webContents.send('autoUpdate', { error: true });
    });
  }
};
