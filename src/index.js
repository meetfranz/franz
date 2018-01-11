import { app, BrowserWindow, shell } from 'electron';
import fs from 'fs-extra';
import path from 'path';

import windowStateKeeper from 'electron-window-state';

import { isDevMode, isWindows } from './environment';
import ipcApi from './electron/ipc-api';
import Tray from './lib/Tray';
import Settings from './electron/Settings';
import handleDeepLink from './electron/deepLinking';
import { appId } from './package.json'; // eslint-disable-line import/no-unresolved
import './electron/exception';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let willQuitApp = false;

// Ensure that the recipe directory exists
fs.ensureDir(path.join(app.getPath('userData'), 'recipes'));
fs.emptyDirSync(path.join(app.getPath('userData'), 'recipes', 'temp'));

// Set App ID for Windows
if (isWindows) {
  app.setAppUserModelId(appId);
}

// Force single window
const isSecondInstance = app.makeSingleInstance((argv) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    if (process.platform === 'win32') {
      // Keep only command line / deep linked arguments
      const url = argv.slice(1);

      if (url) {
        handleDeepLink(mainWindow, url.toString());
      }
    }
  }
});

if (isSecondInstance) {
  console.log('An instance of Franz is already running. Exiting...');
  app.exit();
}

// Lets disable Hardware Acceleration until we have a better solution
// to deal with the high-perf-gpu requirement of some services

// Disabled to test tweetdeck glitches
// app.disableHardwareAcceleration();

// Initialize Settings
const settings = new Settings();

const createWindow = () => {
  // Remember window size
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: 'hidden',
    backgroundColor: '#3498db',
    autoHideMenuBar: true,
  });

  // Initialize System Tray
  const trayIcon = new Tray();

  // Initialize ipcApi
  ipcApi({ mainWindow, settings, trayIcon });

  // Manage Window State
  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('close', (e) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (!willQuitApp && (settings.get('runInBackground') === undefined || settings.get('runInBackground'))) {
      e.preventDefault();
      if (isWindows) {
        mainWindow.minimize();
      } else {
        mainWindow.hide();
      }

      if (isWindows && settings.get('minimizeToSystemTray')) {
        mainWindow.setSkipTaskbar(true);
      }
    } else {
      app.quit();
    }
  });

  // For Windows we need to store a flag to properly restore the window
  // if the window was maximized before minimizing it so system tray
  mainWindow.on('minimize', () => {
    app.wasMaximized = app.isMaximized;

    if (settings.get('minimizeToSystemTray')) {
      mainWindow.setSkipTaskbar(true);
      trayIcon.show();
    }
  });

  mainWindow.on('maximize', () => {
    app.isMaximized = true;
  });

  mainWindow.on('unmaximize', () => {
    app.isMaximized = false;
  });

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false);

    if (app.wasMaximized) {
      mainWindow.maximize();
    }

    if (!settings.get('enableSystemTray')) {
      trayIcon.hide();
    }
  });

  mainWindow.on('show', () => {
    mainWindow.setSkipTaskbar(false);
  });

  app.mainWindow = mainWindow;
  app.isMaximized = mainWindow.isMaximized();

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (settings.get('runInBackground') === undefined
    || settings.get('runInBackground')) {
    app.quit();
  }
});

app.on('before-quit', () => {
  willQuitApp = true;
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('will-finish-launching', () => {
  // Protocol handler for osx
  app.on('open-url', (event, url) => {
    event.preventDefault();
    console.log(`open-url event: ${url}`);
    handleDeepLink(mainWindow, url);
  });
});

// Register App URL
app.setAsDefaultProtocolClient('franz');
