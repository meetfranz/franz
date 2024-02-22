import appIndicator from './appIndicator';
import autoUpdate from './autoUpdate';
import browserViewManager from './browserViewManager';
import cld from './cld';
import desktopCapturer from './desktopCapturer';
import download from './download';
import focusState from './focusState';
import fullscreenStatus from './fullscreen';
import macOSPermissions from './macOSPermissions';
import overlayWindow from './overlayWindow';
import serviceCache from './serviceCache';
import settings from './settings';
import subscriptionWindow from './subscriptionWindow';

export default (params) => {
  settings(params);
  autoUpdate(params);
  appIndicator(params);
  download(params);
  cld(params);
  desktopCapturer();
  focusState(params);
  fullscreenStatus(params);
  subscriptionWindow(params);
  serviceCache();
  browserViewManager(params);
  overlayWindow(params);
  macOSPermissions(params);
};
