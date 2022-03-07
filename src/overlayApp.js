import { webFrame } from 'electron';

import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from 'react-dom';
import {
  Router, Route, hashHistory,
} from 'react-router';

import '@babel/polyfill';
import smoothScroll from 'smoothscroll-polyfill';
import { ThemeProvider } from 'react-jss';
import { theme } from '@meetfranz/theme';

import translations from './i18n/translations';
import ShareFranz from './features/shareFranz/Component';

// Add Polyfills
smoothScroll.polyfill();

// Basic electron Setup
webFrame.setVisualZoomLevelLimits(1, 1);

const locale = 'en';

window.franz = {
  features: {},
};

window.addEventListener('load', () => {
  const preparedApp = (
    <IntlProvider
      {...{ locale, key: locale, messages: translations[locale] }}
      ref={(intlProvider) => { window.intl = intlProvider ? intlProvider.getChildContext().intl : null; }}
    >
      <ThemeProvider theme={theme('default')}>
        <Router history={hashHistory}>
          <Route
            path="/share-franz"
            component={ShareFranz}
          />
        </Router>

      </ThemeProvider>
    </IntlProvider>
  );
  render(preparedApp, document.getElementById('root'));
});

// Prevent drag and drop into window from redirecting
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
window.addEventListener('dragover', event => event.stopPropagation());
window.addEventListener('drop', event => event.stopPropagation());
