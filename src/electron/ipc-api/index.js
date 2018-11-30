import autoUpdate from './autoUpdate';
import settings from './settings';
import appIndicator from './appIndicator';
import download from './download';

export default (params) => {
  settings(params);
  autoUpdate(params);
  appIndicator(params);
  download(params);
};
