import { SpellCheckHandler } from 'electron-spellchecker';

import { isMac } from '../environment';

export default class Spellchecker {
  isInitialized = false;
  handler = null;
  initRetries = 0;

  initialize() {
    this.handler = new SpellCheckHandler();

    if (!isMac) {
      this.attach();
    } else {
      this.isInitialized = true;
    }
  }

  attach() {
    let initFailed = false;

    if (this.initRetries > 3) {
      console.error('Could not initialize spellchecker');
      return;
    }

    try {
      this.handler.attachToInput();
      this.handler.switchLanguage(navigator.language);
    } catch (err) {
      initFailed = true;
      this.initRetries = +1;
      setTimeout(() => { this.attach(); console.warn('Spellchecker init failed, trying again in 5s'); }, 5000);
    }

    if (!initFailed) {
      this.isInitialized = true;
    }
  }
}

