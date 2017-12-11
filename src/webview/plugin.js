import { ipcRenderer } from 'electron';
import { ContextMenuListener, ContextMenuBuilder } from 'electron-spellchecker';
import path from 'path';

import { isDevMode } from '../environment';
import RecipeWebview from './lib/RecipeWebview';

import Spellchecker from './spellchecker.js';
import './notifications.js';
import './ime.js';

ipcRenderer.on('initializeRecipe', (e, data) => {
  const modulePath = path.join(data.recipe.path, 'webview.js');
  // Delete module from cache
  delete require.cache[require.resolve(modulePath)];
  try {
    // eslint-disable-next-line
    require(modulePath)(new RecipeWebview(), data);
  } catch (err) {
    console.error(err);
  }
});

let contextMenuBuilder = new ContextMenuBuilder(null, null, isDevMode);
const spellchecker = new Spellchecker();

new ContextMenuListener((info) => { // eslint-disable-line
  contextMenuBuilder.showPopupMenu(info);
});

ipcRenderer.on('settings-update', (e, data) => {
  if (data.enableSpellchecking && !spellchecker.isInitialized) {
    spellchecker.initialize();

    contextMenuBuilder = new ContextMenuBuilder(spellchecker.handler, null, isDevMode);

    new ContextMenuListener((info) => { // eslint-disable-line
      contextMenuBuilder.showPopupMenu(info);
    });
  }
});

// initSpellche

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.sendToHost('hello');
}, false);
