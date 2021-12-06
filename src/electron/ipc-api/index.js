import autoUpdate from './autoUpdate';
import settings from './settings';
import appIndicator from './appIndicator';
import download from './download';
import cld from './cld';
import dnd from './dnd';
import desktopCapturer from './desktopCapturer';
import focusState from './focusState';
import serviceWebView from '../../features/serviceWebview/ipc';

export default (params) => {
  settings(params);
  autoUpdate(params);
  appIndicator(params);
  download(params);
  cld(params);
  dnd();
  desktopCapturer();
  focusState(params);
  serviceWebView(params);
};
