import { ipcRenderer } from 'electron';
import path from 'path';
import { autorun, computed, observable } from 'mobx';

import RecipeWebview from './lib/RecipeWebview';

import spellchecker, { switchDict, disable as disableSpellchecker } from './spellchecker';
import { injectDarkModeStyle, isDarkModeStyleInjected, removeDarkModeStyle } from './darkmode';
import contextMenu from './contextMenu';
import './notifications';

import { DEFAULT_APP_SETTINGS } from '../config';

const debug = require('debug')('Franz:Plugin');

class RecipeController {
  @observable settings = {
    overrideSpellcheckerLanguage: false,
    app: DEFAULT_APP_SETTINGS,
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
    'get-service-id': 'serviceIdEcho',
  }

  constructor() {
    this.initialize();
  }

  @computed get spellcheckerLanguage() {
    return this.settings.service.spellcheckerLanguage || this.settings.app.spellcheckerLanguage;
  }

  async initialize() {
    Object.keys(this.ipcEvents).forEach((channel) => {
      ipcRenderer.on(channel, (...args) => {
        debug('Received IPC event for channel', channel, 'with', ...args);
        this[this.ipcEvents[channel]](...args);
      });
    });

    debug('Send "hello" to host');
    setTimeout(() => ipcRenderer.sendToHost('hello'), 100);

    this.spellcheckingProvider = await spellchecker();
    contextMenu(
      this.spellcheckingProvider,
      () => this.settings.app.enableSpellchecking,
      () => this.settings.app.spellcheckerLanguage,
      () => this.spellcheckerLanguage,
    );

    autorun(() => this.update());
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
    debug('enableSpellchecking', this.settings.app.enableSpellchecking);
    debug('isDarkModeEnabled', this.settings.service.isDarkModeEnabled);
    debug('System spellcheckerLanguage', this.settings.app.spellcheckerLanguage);
    debug('Service spellcheckerLanguage', this.settings.service.spellcheckerLanguage);

    if (this.settings.app.enableSpellchecking) {
      debug('Setting spellchecker language to', this.spellcheckerLanguage);
      switchDict(this.spellcheckerLanguage);
    } else {
      debug('Disable spellchecker');
      disableSpellchecker();
    }

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

  serviceIdEcho(event) {
    event.sender.send('service-id', this.settings.service.id);
  }
}

/* eslint-disable no-new */
new RecipeController();
/* eslint-enable no-new */

// Patching window.open
const originalWindowOpen = window.open;

window.open = (url, frameName, features) => {
  // We need to differentiate if the link should be opened in a popup or in the systems default browser
  if (!frameName && !features) {
    return ipcRenderer.sendToHost('new-window', url);
  }

  return originalWindowOpen(url, frameName, features);
};
