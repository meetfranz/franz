import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
} from 'electron';

import fs from 'fs-extra';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

import {
  isDevMode,
  isMac,
  isWindows,
  isLinux,
} from './environment';

import { mainIpcHandler as basicAuthHandler } from './features/basicAuth';

// DEV MODE: Save user data into FranzDev
if (isDevMode) {
  app.setPath('userData', path.join(app.getPath('appData'), 'FranzDev'));
}
/* eslint-disable import/first */
import ipcApi from './electron/ipc-api';
import Tray from './lib/Tray';
import Settings from './electron/Settings';
import handleDeepLink from './electron/deepLinking';
import { isPositionValid } from './electron/windowUtils';
import { appId } from './package.json'; // eslint-disable-line import/no-unresolved
import './electron/exception';

import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_WINDOW_OPTIONS,
} from './config';
/* eslint-enable import/first */

const debug = require('debug')('Franz:App');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let willQuitApp = false;

// Ensure that the recipe directory exists
fs.emptyDirSync(path.join(app.getPath('userData'), 'recipes', 'temp'));
fs.ensureFileSync(path.join(app.getPath('userData'), 'window-state.json'));

// Set App ID for Windows
if (isWindows) {
  app.setAppUserModelId(appId);
}

// Force single window
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      if (isWindows) {
        // Keep only command line / deep linked arguments
        const url = argv.slice(1);

        if (url) {
          handleDeepLink(mainWindow, url.toString());
        }
      }

      if (argv.includes('--reset-window')) {
        // Needs to be delayed to not interfere with mainWindow.restore();
        setTimeout(() => {
          debug('Resetting windows via Task');
          mainWindow.setPosition(DEFAULT_WINDOW_OPTIONS.x + 100, DEFAULT_WINDOW_OPTIONS.y + 100);
          mainWindow.setSize(DEFAULT_WINDOW_OPTIONS.width, DEFAULT_WINDOW_OPTIONS.height);
        }, 1);
      }
    }
  });

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {
  });
}
// const isSecondInstance = app.makeSingleInstance((argv) => {
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) mainWindow.restore();
//     mainWindow.focus();

//     if (process.platform === 'win32') {
//       // Keep only command line / deep linked arguments
//       const url = argv.slice(1);

//       if (url) {
//         handleDeepLink(mainWindow, url.toString());
//       }
//     }
//   }

//   if (argv.includes('--reset-window')) {
//     // Needs to be delayed to not interfere with mainWindow.restore();
//     setTimeout(() => {
//       debug('Resetting windows via Task');
//       mainWindow.setPosition(DEFAULT_WINDOW_OPTIONS.x + 100, DEFAULT_WINDOW_OPTIONS.y + 100);
//       mainWindow.setSize(DEFAULT_WINDOW_OPTIONS.width, DEFAULT_WINDOW_OPTIONS.height);
//     }, 1);
//   }
// });

// if (isSecondInstance) {
//   console.log('An instance of Franz is already running. Exiting...');
//   app.exit();
// }

// Fix Unity indicator issue
// https://github.com/electron/electron/issues/9046
if (isLinux && ['Pantheon', 'Unity:Unity7'].indexOf(process.env.XDG_CURRENT_DESKTOP) !== -1) {
  process.env.XDG_CURRENT_DESKTOP = 'Unity';
}

// Initialize Settings
const settings = new Settings('app', DEFAULT_APP_SETTINGS);
const proxySettings = new Settings('proxy');

// Disable GPU acceleration
if (!settings.get('enableGPUAcceleration')) {
  debug('Disable GPU Acceleration');
  app.disableHardwareAcceleration();
}

const createWindow = () => {
  // Remember window size
  const mainWindowState = windowStateKeeper({
    defaultWidth: DEFAULT_WINDOW_OPTIONS.width,
    defaultHeight: DEFAULT_WINDOW_OPTIONS.height,
  });

  let posX = mainWindowState.x || DEFAULT_WINDOW_OPTIONS.x;
  let posY = mainWindowState.y || DEFAULT_WINDOW_OPTIONS.y;

  if (!isPositionValid({ x: posX, y: posY })) {
    debug('Window is out of screen bounds, resetting window');
    posX = DEFAULT_WINDOW_OPTIONS.x;
    posY = DEFAULT_WINDOW_OPTIONS.y;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: posX,
    y: posY,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: isMac ? 'hidden' : '',
    frame: isLinux,
    backgroundColor: !settings.get('darkMode') ? '#3498db' : '#1E1E1E',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Initialize System Tray
  const trayIcon = new Tray();

  // Initialize ipcApi
  ipcApi({
    mainWindow,
    settings: {
      app: settings,
      proxy: proxySettings,
    },
    trayIcon,
  });

  // Manage Window State
  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode || process.argv.includes('--devtools')) {
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

      if (isWindows) {
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
app.on('ready', () => {
  if (process.platform === 'win32') {
    app.setUserTasks([{
      program: process.execPath,
      arguments: `${isDevMode ? `${__dirname} ` : ''}--reset-window`,
      iconPath: path.join(`${__dirname}`, '../src/assets/images/taskbar/win32/display.ico'),
      iconIndex: 0,
      title: 'Move Franz to Current Display',
      description: 'Restore the position and size of Franz',
    }]);
  }

  createWindow();
});

// This is the worst possible implementation as the webview.webContents based callback doesn't work 🖕
// TODO: rewrite to handle multiple login calls
const noop = () => null;
let authCallback = noop;
app.on('login', (event, webContents, request, authInfo, callback) => {
  authCallback = callback;
  debug('browser login event', authInfo);
  event.preventDefault();
  if (authInfo.isProxy && authInfo.scheme === 'basic') {
    webContents.send('get-service-id');

    ipcMain.once('service-id', (e, id) => {
      debug('Received service id', id);

      const ps = proxySettings.get(id);
      callback(ps.user, ps.password);
    });
  } else if (authInfo.scheme === 'basic') {
    debug('basic auth handler', authInfo);
    basicAuthHandler(mainWindow, authInfo);
  }
});

// TODO: evaluate if we need to store the authCallback for every service
ipcMain.on('feature-basic-auth-credentials', (e, { user, password }) => {
  debug('Received basic auth credentials', user, '********');

  authCallback(user, password);
  authCallback = noop;
});

ipcMain.on('feature-basic-auth-cancel', () => {
  debug('Cancel basic auth');

  authCallback(null);
  authCallback = noop;
});

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
