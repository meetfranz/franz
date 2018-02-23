import { LIVE_API, DEV_API, LOCAL_API } from './config';

export const isDevMode = Boolean(process.execPath.match(/[\\/]electron/));
export const useLiveAPI = process.env.LIVE_API;
export const useLocalAPI = process.env.LOCAL_API;

let platform = process.platform;
if (process.env.OS_PLATFORM) {
  platform = process.env.OS_PLATFORM;
}

export const isMac = platform === 'darwin';
export const isWindows = platform === 'win32';
export const isLinux = platform === 'linux';

export const ctrlKey = isMac ? '⌘' : 'Ctrl';
export const cmdKey = isMac ? 'Cmd' : 'Ctrl';

let api;
if (!isDevMode || (isDevMode && useLiveAPI)) {
  api = LIVE_API;
} else if (isDevMode && useLocalAPI) {
  api = LOCAL_API;
} else {
  api = DEV_API;
}

export const API = api;
