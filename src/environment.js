import { LIVE_API, DEV_API, LOCAL_API } from './config';

export const isDevMode = Boolean(process.execPath.match(/[\\/]electron/));
export const useLiveAPI = process.env.LIVE_API;
export const useLocalAPI = process.env.LOCAL_API;

export const isMac = process.platform === 'darwin';
export const isWindows = process.platform === 'win32';
export const isLinux = process.platform === 'linux';

let ctrlShortcutKey;
if (isMac) {
  ctrlShortcutKey = '⌘';
} else if (isWindows) {
  ctrlShortcutKey = 'Ctrl';
} else {
  ctrlShortcutKey = 'Alt';
}

export const ctrlKey = ctrlShortcutKey;

let api;
if (!isDevMode || (isDevMode && useLiveAPI)) {
  api = LIVE_API;
} else if (isDevMode && useLocalAPI) {
  api = LOCAL_API;
} else {
  api = DEV_API;
}

export const API = api;
