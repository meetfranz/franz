import { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } from 'electron-spellchecker';

window.spellCheckHandler = new SpellCheckHandler();
setTimeout(() => {
  window.spellCheckHandler.attachToInput();
}, 1000);

// TODO: should we set the language to user settings?
// window.spellCheckHandler.switchLanguage('en-US');

const contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
const contextMenuListener = new ContextMenuListener((info) => { // eslint-disable-line
  contextMenuBuilder.showPopupMenu(info);
});
