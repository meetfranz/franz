import { ipcRenderer } from 'electron';
import { ContextMenuBuilder, ContextMenuListener } from 'electron-spellchecker';
import path from 'path';

import { isDevMode } from '../environment';
import RecipeWebview from './lib/RecipeWebview';
import './notifications';

import Spellchecker from './spellchecker';

const debug = require('debug')('Plugin');

ipcRenderer.on('initializeRecipe', (e, data) => {
  const modulePath = path.join(data.recipe.path, 'webview.js');
  // Delete module from cache
  delete require.cache[require.resolve(modulePath)];
  try {
    // eslint-disable-next-line
    require(modulePath)(new RecipeWebview(), data);
    debug('Initialize Recipe');
  } catch (err) {
    debug('Recipe initialization failed', err);
  }
});

const spellchecker = new Spellchecker();
spellchecker.initialize();

const contextMenuBuilder = new ContextMenuBuilder(spellchecker.handler, null, isDevMode);

new ContextMenuListener((info) => { // eslint-disable-line
  contextMenuBuilder.showPopupMenu(info);
});

ipcRenderer.on('settings-update', (e, data) => {
  spellchecker.toggleSpellchecker(data.enableSpellchecking);
  debug('Settings update received', data);
});

// initSpellche

document.addEventListener('DOMContentLoaded', () => {
  const changeTheme = (themeName) => {
    const currentClassList = document.body.classList;
    if (themeName && !currentClassList.contains(themeName)) {
      let name = themeName;
      if (!themeName.startsWith('theme-')) {
        name = `theme-${themeName}`;
      }
      [...currentClassList].forEach((c) => {
        if (c && c.startsWith('theme-')) {
          document.body.classList.remove(c);
        }
      });
      if (name === 'theme-regular') {
        return;
      }
      document.body.classList.add(name);
    }
  };

  ipcRenderer.sendToHost('hello');

  ipcRenderer.on('change-theme', (...args) => {
    console.log('plugin.js theme-changer', args);
    changeTheme(args[1]);
  });
}, false);

// Patching window.open
const originalWindowOpen = window.open;

window.open = (url, frameName, features) => {
  // We need to differentiate if the link should be opened in a popup or in the systems default browser 
  if (!frameName && !features) {
    return ipcRenderer.sendToHost('new-window', url);
  }

  return originalWindowOpen(url, frameName, features);
};
