import PropTypes from 'prop-types';

import defineActions from './lib/actions';
import service from './service';
import recipe from './recipe';
import recipePreview from './recipePreview';
import ui from './ui';
import app from './app';
import user from './user';
import payment from './payment';
import news from './news';
import settings from './settings';
import requests from './requests';
import workspace from '../features/workspaces/actions';

const actions = Object.assign({}, {
  service,
  recipe,
  recipePreview,
  ui,
  app,
  user,
  payment,
  news,
  settings,
  requests,
  workspace,
});

export default defineActions(actions, PropTypes.checkPropTypes);
