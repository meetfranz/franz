import autoUpdate from './autoUpdate';
import settings from './settings';
import appIndicator from './appIndicator';

export default (params) => {
  settings(params);
  autoUpdate(params);
  appIndicator(params);
};
