export const CHECK_INTERVAL = 1000 * 3600; // How often should we perform checks
export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.franzinfra.com';
export const GA_ID = 'UA-74126766-6';

export const DEFAULT_APP_SETTINGS = {
  autoLaunchOnStart: true,
  autoLaunchInBackground: false,
  runInBackground: false,
  enableSystemTray: true,
  minimizeToSystemTray: false,
  locale: 'en-us', // TODO: Replace with proper solution once translations are in
  beta: false,
};
