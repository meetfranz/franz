import { webFrame } from 'electron';

import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { render } from 'react-dom';
import {
  hashHistory,
  IndexRedirect,
  Route,
  Router,
} from 'react-router';

import '@babel/polyfill';
import smoothScroll from 'smoothscroll-polyfill';

import actions from './actions';
import apiFactory from './api';
import LocalApi from './api/server/LocalApi';
import ServerApi from './api/server/ServerApi';
import MenuFactory from './lib/Menu';
import TouchBarFactory from './lib/TouchBar';
import * as analytics from './lib/analytics';
import storeFactory from './stores';

import I18N from './I18n';
import AuthLayoutContainer from './containers/auth/AuthLayoutContainer';
import ImportScreen from './containers/auth/ImportScreen';
import InviteScreen from './containers/auth/InviteScreen';
import LoginScreen from './containers/auth/LoginScreen';
import PasswordScreen from './containers/auth/PasswordScreen';
import PricingScreen from './containers/auth/PricingScreen';
import SetupAssistentScreen from './containers/auth/SetupAssistantScreen';
import SignupScreen from './containers/auth/SignupScreen';
import WelcomeScreen from './containers/auth/WelcomeScreen';
import AppLayoutContainer from './containers/layout/AppLayoutContainer';
import AccountScreen from './containers/settings/AccountScreen';
import EditServiceScreen from './containers/settings/EditServiceScreen';
import EditSettingsScreen from './containers/settings/EditSettingsScreen';
import EditUserScreen from './containers/settings/EditUserScreen';
import InviteSettingsScreen from './containers/settings/InviteScreen';
import RecipesScreen from './containers/settings/RecipesScreen';
import ServicesScreen from './containers/settings/ServicesScreen';
import SettingsWindow from './containers/settings/SettingsWindow';
import TeamScreen from './containers/settings/TeamScreen';
import SubscriptionPopupScreen from './containers/subscription/SubscriptionPopupScreen';
import { isMac } from './environment';
import { ANNOUNCEMENTS_ROUTES } from './features/announcements';
import AnnouncementScreen from './features/announcements/components/AnnouncementScreen';
import { WORKSPACES_ROUTES } from './features/workspaces';
import EditWorkspaceScreen from './features/workspaces/containers/EditWorkspaceScreen';
import WorkspacesScreen from './features/workspaces/containers/WorkspacesScreen';

// Add Polyfills
smoothScroll.polyfill();

// Basic electron Setup
webFrame.setVisualZoomLevelLimits(1, 1);

window.addEventListener('load', () => {
  const api = apiFactory(new ServerApi(), new LocalApi());
  const router = new RouterStore();
  const history = syncHistoryWithStore(hashHistory, router);
  const stores = storeFactory(api, actions, router);
  const menu = isMac ? new MenuFactory(stores, actions) : null;
  const touchBar = new TouchBarFactory(stores, actions);

  window.franz = {
    stores,
    actions,
    api,
    menu,
    touchBar,
    analytics,
    features: {},
    render() {
      const preparedApp = (
        <Provider stores={stores} actions={actions}>
          <I18N>
            <Router history={history}>
              <Route path="/" component={AppLayoutContainer}>
                <Route path={ANNOUNCEMENTS_ROUTES.TARGET} component={AnnouncementScreen} />
                <Route path="/settings" component={SettingsWindow}>
                  <IndexRedirect to="/settings/recipes" />
                  <Route path="/settings/recipes" component={RecipesScreen} />
                  <Route path="/settings/recipes/:filter" component={RecipesScreen} />
                  <Route path="/settings/services" component={ServicesScreen} />
                  <Route path="/settings/services/:action/:id" component={EditServiceScreen} />
                  <Route path={WORKSPACES_ROUTES.ROOT} component={WorkspacesScreen} />
                  <Route path={WORKSPACES_ROUTES.EDIT} component={EditWorkspaceScreen} />
                  <Route path="/settings/user" component={AccountScreen} />
                  <Route path="/settings/user/edit" component={EditUserScreen} />
                  <Route path="/settings/team" component={TeamScreen} />
                  <Route path="/settings/app" component={EditSettingsScreen} />
                  <Route path="/settings/invite" component={InviteSettingsScreen} />
                  <Route path="/announcements/*" component={null} />
                </Route>
              </Route>
              <Route path="/auth" component={AuthLayoutContainer}>
                <IndexRedirect to="/auth/welcome" />
                <Route path="/auth/welcome" component={WelcomeScreen} />
                <Route path="/auth/login" component={LoginScreen} />
                <Route path="/auth/signup">
                  <IndexRedirect to="/auth/signup/form" />
                  <Route path="/auth/signup/form" component={SignupScreen} />
                  <Route path="/auth/signup/pricing" component={PricingScreen} />
                  <Route path="/auth/signup/import" component={ImportScreen} />
                  <Route path="/auth/signup/setup" component={SetupAssistentScreen} />
                  <Route path="/auth/signup/invite" component={InviteScreen} />
                </Route>
                <Route path="/auth/password" component={PasswordScreen} />
                <Route path="/auth/logout" component={LoginScreen} />
              </Route>
              <Route path="/payment/:url" component={SubscriptionPopupScreen} />
              <Route path="*">
                <IndexRedirect to="/" />
              </Route>
            </Router>
          </I18N>
        </Provider>
      );
      render(preparedApp, document.getElementById('root'));
    },
  };
  window.franz.render();
});

// Prevent drag and drop into window from redirecting
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
window.addEventListener('dragover', event => event.stopPropagation());
window.addEventListener('drop', event => event.stopPropagation());
