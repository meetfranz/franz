import electron from 'electron';
import path from 'path';

const app = process.type === 'renderer' ? electron.remote.app : electron.app;

export const CHECK_INTERVAL = 1000 * 3600; // How often should we perform checks
export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.franzinfra.com';
export const GA_ID = 'UA-74126766-6';

export const DEFAULT_APP_SETTINGS = {
  autoLaunchInBackground: false,
  runInBackground: true,
  enableSystemTray: true,
  minimizeToSystemTray: false,
  showDisabledServices: true,
  showMessageBadgeWhenMuted: true,
  enableSpellchecking: true,
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,
};

export const FRANZ_SERVICE_REQUEST = 'http://bit.ly/franz-service-request';
export const FRANZ_TRANSLATION = 'http://bit.ly/franz-translate';

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config', 'settings.json');
