import { ipcRenderer } from 'electron';
import path from 'path';

import RecipeWebview from './lib/RecipeWebview';

import Spellchecker from './spellchecker.js';
import './notifications.js';
import './ime.js';

const spellchecker = new Spellchecker();

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
  if (data.enableSpellchecking) {
    if (!spellchecker.isEnabled) {
      spellchecker.enable();

      // TODO: this does not work yet, needs more testing
      // if (data.spellcheckingLanguage !== 'auto') {
      //   console.log('set spellchecking language to', data.spellcheckingLanguage);
      //   spellchecker.switchLanguage(data.spellcheckingLanguage);
      // }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.sendToHost('hello');
}, false);
