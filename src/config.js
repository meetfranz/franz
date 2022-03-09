import path from 'path';
import ms from 'ms';

import { asarPath } from './helpers/asar-helpers';
import { DEFAULT_APP_SETTINGS_VANILLA } from './configVanilla';

const { app, nativeTheme } = process.type === 'renderer' ? require('@electron/remote') : require('electron');

export const CHECK_INTERVAL = ms('1h'); // How often should we perform checks

export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.franzinfra.com';

export const LOCAL_WS_API = 'ws://localhost:3000';
export const DEV_WS_API = 'wss://dev.franzinfra.com';
export const LIVE_WS_API = 'wss://api.franzinfra.com';

export const LOCAL_API_WEBSITE = 'http://localhost:3333';
// export const DEV_API_WEBSITE = 'https://meetfranz.com';t
export const DEV_API_WEBSITE = 'http://hash-58883791519ef6288c952316bdce7fb462283893.franzstaging.com/'; // TODO: revert me
export const LIVE_API_WEBSITE = 'https://meetfranz.com';

export const STATS_API = 'https://stats.franzinfra.com';

export const LOCAL_TODOS_FRONTEND_URL = 'http://localhost:4000';
export const PRODUCTION_TODOS_FRONTEND_URL = 'https://app.franztodos.com';
export const DEVELOPMENT_TODOS_FRONTEND_URL = 'https://development--franz-todos.netlify.com';

export const CDN_URL = 'https://cdn.franzinfra.com';

export const GA_ID_DEV = 'UA-74126766-12';
export const GA_ID_PROD = 'UA-74126766-10';

export const DEFAULT_APP_SETTINGS = Object.assign(DEFAULT_APP_SETTINGS_VANILLA, {
  darkMode: process.platform === 'darwin' ? nativeTheme.shouldUseDarkColors : false, // We can't use refs from `./environment` at this time
});

export const DEFAULT_FEATURES_CONFIG = {
  isSpellcheckerIncludedInCurrentPlan: true,
  needToWaitToProceed: false,
  needToWaitToProceedConfig: {
    delayOffset: ms('1h'),
    wait: ms('10s'),
    needToClick: false,
    showPoweredBy: false,
  },
  isServiceProxyEnabled: false,
  isServiceProxyIncludedInCurrentPlan: false,
  isAnnouncementsEnabled: true,
  isWorkspaceIncludedInCurrentPlan: true,
  isWorkspaceEnabled: false,
};

export const DEFAULT_WINDOW_OPTIONS = {
  width: 800,
  height: 600,
  x: 0,
  y: 0,
};

export const FRANZ_SERVICE_REQUEST = 'https://bit.ly/franz-service-request-support';
export const FRANZ_TRANSLATION = 'https://bit.ly/franz-translate';
export const FRANZ_DEV_DOCS = 'http://bit.ly/franz-dev-hub';

export const FILE_SYSTEM_SETTINGS_TYPES = [
  'app',
  'proxy',
];

// Set app directory before loading user modules
if (process.env.FRANZ_APPDATA_DIR != null) {
  app.setPath('appData', process.env.FRANZ_APPDATA_DIR);
  app.setPath('userData', path.join(app.getPath('appData')));
} else if (process.platform === 'win32') {
  app.setPath('appData', process.env.APPDATA);
  app.setPath('userData', path.join(app.getPath('appData'), app.getName()));
}

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config');

// Replacing app.asar is not beautiful but unforunately necessary
export const DICTIONARY_PATH = asarPath(path.join(__dirname, 'dictionaries'));

export const ALLOWED_PROTOCOLS = [
  'https:',
  'http:',
  'ftp:',
  'franz:',
  'mailto:',
];

export const PLANS = {
  PERSONAL: 'personal',
  PRO: 'pro',
  LEGACY: 'legacy',
  FREE: 'free',
};

export const PLANS_MAPPING = {
  'franz-personal-monthly': PLANS.PERSONAL,
  'franz-personal-yearly': PLANS.PERSONAL,
  'franz-pro-monthly': PLANS.PRO,
  'franz-pro-yearly': PLANS.PRO,
  'franz-supporter-license': PLANS.LEGACY,
  'franz-supporter-license-x1': PLANS.LEGACY,
  'franz-supporter-license-x2': PLANS.LEGACY,
  'franz-supporter-license-year': PLANS.LEGACY,
  'franz-supporter-license-year-x1': PLANS.LEGACY,
  'franz-supporter-license-year-x2': PLANS.LEGACY,
  'franz-supporter-license-year-2019': PLANS.LEGACY,
  free: PLANS.FREE,
};

export const TAB_BAR_WIDTH = 68;

export const DEFAULT_WEB_CONTENTS_ID = 1;

export const TODOS_RECIPE_ID = 'franz-todos';
