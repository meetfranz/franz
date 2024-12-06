import { ipcRenderer, webFrame } from 'electron';

import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import {
  Route,
  Router,
  hashHistory,
} from 'react-router';

import '@babel/polyfill';
import { theme } from '@meetfranz/theme';
import { ThemeProvider } from 'react-jss';
import smoothScroll from 'smoothscroll-polyfill';

import SubscriptionPopupScreen from './containers/subscription/SubscriptionPopupScreen';
import { Component as BasicAuth } from './features/basicAuth';
import { Component as DesktopCapturer } from './features/desktopCapturer';
import PlanSelectionScreen from './features/planSelection/containers/PlanSelectionScreen';
import ShareFranz from './features/shareFranz/Component';
import translations from './i18n/translations';
import { GET_SETTINGS, SEND_SETTINGS } from './ipcChannels';

// Add Polyfills
smoothScroll.polyfill();

// Basic electron Setup
webFrame.setVisualZoomLevelLimits(1, 1);

window.franz = {
  features: {},
};

const setup = (settings) => {
  const preparedApp = (
    <IntlProvider
      {...{ locale: settings.locale, key: settings.locale, messages: translations[settings.locale] }}
      ref={(intlProvider) => { window.intl = intlProvider ? intlProvider.getChildContext().intl : null; }}
    >
      <ThemeProvider theme={theme(settings.theme)}>
        <Router history={hashHistory}>
          <Route path="/share-franz" component={ShareFranz} />
          <Route path="/payment/:url" component={SubscriptionPopupScreen} />
          <Route path="/plan-selection" component={PlanSelectionScreen} />
          <Route path="/screen-share/:webContentsId" component={DesktopCapturer} />
          <Route path="/basic-auth/:webContentsId" component={BasicAuth} />
        </Router>

      </ThemeProvider>
    </IntlProvider>
  );

  render(preparedApp, document.getElementById('root'));
};

let overlayAppInitialized = false;
let checkAppInitLoop;

function initOverlayApp() {
  if (!overlayAppInitialized) {
    ipcRenderer.send(GET_SETTINGS, 'app');
  } else {
    clearInterval(checkAppInitLoop);
  }
}

window.addEventListener('load', () => {
  initOverlayApp();

  checkAppInitLoop = setInterval(() => initOverlayApp(), 500);
});

ipcRenderer.on(SEND_SETTINGS, (event, { data: settings }) => {
  setup(settings);

  if (settings.darkMode) {
    document.querySelector('body').classList.add('theme__dark');
  }

  overlayAppInitialized = true;
});

// Prevent drag and drop into window from redirecting
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
window.addEventListener('dragover', event => event.stopPropagation());
window.addEventListener('drop', event => event.stopPropagation());
