import { observable } from 'mobx';
import { createDownloader } from 'hunspell-dict-downloader';

import Store from './lib/Store';

import { DICTIONARY_PATH } from '../config';

const debug = require('debug')('Franz:DictionaryStore');

export default class DictionaryStore extends Store {
  @observable available = []
  @observable installed = []

  _dictDownloader = null

  constructor(...args) {
    super(...args);

    this.registerReactions([
      this._downloadDictForUserLocale.bind(this),
    ]);
  }

  async setup() {
    this._dictDownloader = await createDownloader(DICTIONARY_PATH);
    debug('dicts', this._dictDownloader);

    this.available = this._dictDownloader.availableDictionaries;
    this.installed = this._dictDownloader.installedDictionaries;

    if (!this.installed.includes('en-us')) {
      this._dictDownloader.installDictionary('en-us');
    }
  }

  _downloadDictForUserLocale() {
    const spellcheckerLanguage = this.stores.settings.app.spellcheckerLanguage;

    debug('trying to Downloading dict for', spellcheckerLanguage);
    if (!this.installed.includes(spellcheckerLanguage) && this.available.includes(spellcheckerLanguage) && spellcheckerLanguage !== 'en-us') {
      debug('Downloading dict for', spellcheckerLanguage);
      this._dictDownloader.installDictionary(spellcheckerLanguage);
    }
  }
}
