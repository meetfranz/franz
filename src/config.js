import electron from 'electron';
import path from 'path';
import isDevMode from 'electron-is-dev';
import ms from 'ms';

import { asarPath } from './helpers/asar-helpers';

const app = process.type === 'renderer' ? electron.remote.app : electron.app;
const systemPreferences = process.type === 'renderer' ? electron.remote.systemPreferences : electron.systemPreferences;

export const CHECK_INTERVAL = ms('1h'); // How often should we perform checks
export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.franzinfra.com';

export const APP_THEMES = {
  'theme-regular': 'Regular',
  'theme-dark': 'Dark',
  'theme-transparent-dark': 'Transparent dark',
};

export const DEFAULT_APP_SETTINGS = {
  autoLaunchInBackground: false,
  runInBackground: true,
  enableSystemTray: true,
  minimizeToSystemTray: false,
  showDisabledServices: true,
  showMessageBadgeWhenMuted: true,
  theme: 'theme-regular',
  appBackground: './assets/images/galaxy2.jpg',
  enableSpellchecking: true,
  spellcheckerLanguage: 'en-us',
  darkMode: process.platform === 'darwin' ? systemPreferences.isDarkMode() : false, // We can't use refs from `./environment` at this time
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,
  serviceLimit: 5,
};

export const DEFAULT_FEATURES_CONFIG = {
  isSpellcheckerPremiumFeature: false,
  needToWaitToProceed: false,
  needToWaitToProceedConfig: {
    delayOffset: 0,
    wait: 0,
  },
  isServiceProxyEnabled: false,
  isServiceProxyPremiumFeature: false,
};

export const DEFAULT_WINDOW_OPTIONS = {
  width: 800,
  height: 600,
  x: 0,
  y: 0,
};

export const FRANZ_SERVICE_REQUEST = 'https://bit.ly/franz-plugin-docs';
export const FRANZ_TRANSLATION = 'https://bit.ly/franz-translate';

export const FILE_SYSTEM_SETTINGS_TYPES = [
  'app',
  'proxy',
];

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config');

// Replacing app.asar is not beautiful but unforunately necessary
export const DICTIONARY_PATH = asarPath(path.join(__dirname, 'dictionaries'));

export const ALLOWED_PROTOCOLS = [
  'https:',
  'http:',
  'ftp:',
];
