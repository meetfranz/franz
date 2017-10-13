const { ipcRenderer } = require('electron');
const path = require('path');

const RecipeWebview = require('./lib/RecipeWebview');

require('./notifications.js');
require('./spellchecker.js');
require('./ime.js');

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

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.sendToHost('hello');
}, false);
