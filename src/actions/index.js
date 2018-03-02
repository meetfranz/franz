import PropTypes from 'prop-types';

import defineActions from './lib/actions';
import service from './service';
import serviceGroup from './serviceGroup';
import recipe from './recipe';
import recipePreview from './recipePreview';
import ui from './ui';
import app from './app';
import user from './user';
import payment from './payment';
import news from './news';
import settings from './settings';
import requests from './requests';

const actions = Object.assign({}, {
  service,
  serviceGroup,
  recipe,
  recipePreview,
  ui,
  app,
  user,
  payment,
  news,
  settings,
  requests,
});

export default defineActions(actions, PropTypes.checkPropTypes);
