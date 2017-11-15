import { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } from 'electron-spellchecker';

import { isMac } from '../environment';

export default class Spellchecker {
  isEnabled = false;
  spellchecker = null;

  enable() {
    this.spellchecker = new SpellCheckHandler();
    if (!isMac) {
      this.spellchecker.attachToInput();
      this.spellchecker.switchLanguage(navigator.language);
    }

    const contextMenuBuilder = new ContextMenuBuilder(this.spellchecker);

    new ContextMenuListener((info) => { // eslint-disable-line
      contextMenuBuilder.showPopupMenu(info);
    });
  }

  // TODO: this does not work yet, needs more testing
  // switchLanguage(language) {
  //   if (language !== 'auto') {
  //     this.spellchecker.switchLanguage(language);
  //   }
  // }
}

