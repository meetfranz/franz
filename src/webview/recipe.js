import { ipcRenderer } from 'electron';
import { debounce } from 'lodash';
import { autorun, observable } from 'mobx';
import path from 'path';

import RecipeWebview from './lib/RecipeWebview';

import { injectDarkModeStyle, isDarkModeStyleInjected, removeDarkModeStyle } from './darkmode';
import './desktopCapturer';
import './notifications';
import { getSpellcheckerLocaleByFuzzyIdentifier } from './spellchecker';

// import { DEFAULT_WEB_CONTENTS_ID } from '../config';
import { DEFAULT_APP_SETTINGS_VANILLA } from '../configVanilla';
import { UPDATE_SPELLCHECKING_LANGUAGE } from '../ipcChannels';

// const DEFAULT_WEB_CONTENTS_ID = 1;

const debug = require('debug')('Franz:Plugin');

window.FranzAPI = {};

class RecipeController {
  id = null;

  @observable settings = {
    app: DEFAULT_APP_SETTINGS_VANILLA,
    service: {
      isDarkModeEnabled: false,
      spellcheckerLanguage: '',
    },
  };

  spellcheckProvider = null;

  ipcEvents = {
    'initialize-recipe': 'loadRecipeModule',
    'settings-update': 'updateAppSettings',
    'service-settings-update': 'updateServiceSettings',
  };

  constructor() {
    this.initialize();
  }

  async initialize() {
    Object.keys(this.ipcEvents).forEach((channel) => {
      ipcRenderer.on(channel, (...args) => {
        debug('Received IPC event for channel', channel, 'with', ...args);
        this[this.ipcEvents[channel]](...args);
      });
    });

    debug('Send "hello" to host');
    setTimeout(() => ipcRenderer.send('hello'), 100);

    autorun(() => this.update());

    this.automaticLanguageDetection();
  }

  loadRecipeModule(event, config, recipe) {
    debug('loadRecipeModule');
    const modulePath = path.join(recipe.path, 'webview.js');
    debug('module path', modulePath);
    // Delete module from cache
    delete require.cache[require.resolve(modulePath)];
    try {
      // eslint-disable-next-line
      require(modulePath)(new RecipeWebview(), {...config, recipe,});
      debug('Initialize Recipe', config, recipe);

      this.settings.service = Object.assign(config, { recipe });
    } catch (err) {
      console.error('Recipe initialization failed', err);
    }
  }

  update() {
    debug('isDarkModeEnabled', this.settings.service.isDarkModeEnabled);

    if (this.settings.service.isDarkModeEnabled) {
      debug('Enable dark mode');
      injectDarkModeStyle(this.settings.service.recipe.path);
    } else if (isDarkModeStyleInjected()) {
      debug('Remove dark mode');
      removeDarkModeStyle();
    }
  }

  updateAppSettings(event, data) {
    this.settings.app = Object.assign(this.settings.app, data);
  }

  updateServiceSettings(event, data) {
    this.settings.service = Object.assign(this.settings.service, data);
  }

  async automaticLanguageDetection() {
    window.addEventListener('keyup', debounce(async (e) => {
      const element = e.target;

      if (!element) return;

      let value = '';
      if (element.isContentEditable) {
        value = element.textContent;
      } else if (element.value) {
        value = element.value;
      }

      // Force a minimum length to get better detection results
      if (value.length < 25) return;

      debug('Detecting language for', value);
      const locale = await ipcRenderer.invoke('detect-language', { sample: value });
      const spellcheckerLocale = getSpellcheckerLocaleByFuzzyIdentifier(locale);
      debug('Language detected reliably, setting spellchecker language to', spellcheckerLocale);
      if (spellcheckerLocale) {
        ipcRenderer.send(UPDATE_SPELLCHECKING_LANGUAGE, { locale: spellcheckerLocale });
      }
    }, 225));
  }
}

/* eslint-disable no-new */
new RecipeController();
/* eslint-enable no-new */

// Patching window.open
const originalWindowOpen = window.open;


window.open = (url, frameName, features) => {
  debug('window.open', url, frameName, features);
  if (!url) {
    // The service hasn't yet supplied a URL (as used in Skype).
    // Return a new dummy window object and wait for the service to change the properties
    const newWindow = {
      location: {
        href: '',
      },
    };

    const checkInterval = setInterval(() => {
      // Has the service changed the URL yet?
      if (newWindow.location.href !== '') {
        if (features) {
          originalWindowOpen(newWindow.location.href, frameName, features);
        } else {
          // Open the new URL
          ipcRenderer.send('new-window', newWindow.location.href);
        }
        clearInterval(checkInterval);
      }
    }, 0);

    setTimeout(() => {
      // Stop checking for location changes after 1 second
      clearInterval(checkInterval);
    }, 1000);

    return newWindow;
  }

  // We need to differentiate if the link should be opened in a popup or in the systems default browser
  if (!frameName && !features && typeof features !== 'string') {
    return ipcRenderer.send('new-window', url);
  }

  if (url) {
    return originalWindowOpen(url, frameName, features);
  }
};
