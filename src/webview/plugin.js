import { ipcRenderer } from 'electron';
import path from 'path';

import RecipeWebview from './lib/RecipeWebview';

import './spellchecker.js';
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

ipcRenderer.on('settings-update', (e, data) => {
  console.log(data);
});

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.sendToHost('hello');
}, false);
