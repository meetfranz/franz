import isDev from 'electron-is-dev';

import {
  LIVE_API,
  DEV_API,
  LOCAL_API,
  LOCAL_API_WEBSITE,
  DEV_API_WEBSITE,
  LIVE_API_WEBSITE,
} from './config';

export const isDevMode = isDev;
export const useLiveAPI = process.env.LIVE_API;
export const useLocalAPI = process.env.LOCAL_API;

let { platform } = process;
if (process.env.OS_PLATFORM) {
  platform = process.env.OS_PLATFORM;
}

export const isMac = platform === 'darwin';
export const isWindows = platform === 'win32';
export const isLinux = platform === 'linux';

export const ctrlKey = isMac ? '⌘' : 'Ctrl';
export const cmdKey = isMac ? 'Cmd' : 'Ctrl';

let api;
let web;
if (!isDevMode || (isDevMode && useLiveAPI)) {
  api = LIVE_API;
  web = LIVE_API_WEBSITE;
} else if (isDevMode && useLocalAPI) {
  api = LOCAL_API;
  web = LOCAL_API_WEBSITE;
} else {
  api = DEV_API;
  web = DEV_API_WEBSITE;
}

export const API = api;
export const WEBSITE = web;
