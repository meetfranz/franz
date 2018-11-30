import { webFrame } from 'electron';
import fs from 'fs';
import path from 'path';
import { SpellCheckerProvider } from 'electron-hunspell';

import { DICTIONARY_PATH } from '../config';

const debug = require('debug')('Franz:spellchecker');

let provider;
let currentDict;
let _isEnabled = false;

async function loadDictionaries() {
  const rawList = fs.readdirSync(DICTIONARY_PATH);

  const dicts = rawList.filter(item => !item.startsWith('.') && fs.lstatSync(path.join(DICTIONARY_PATH, item)).isDirectory());

  debug('Found dictionaries', dicts);

  for (let i = 0; i < dicts.length; i += 1) {
    const fileLocation = `${DICTIONARY_PATH}/${dicts[i]}/${dicts[i]}`;
    debug('Trying to load', fileLocation);
    // eslint-disable-next-line
    await provider.loadDictionary(dicts[i], `${fileLocation}.dic`, `${fileLocation}.aff`);
  }
}

export async function switchDict(locale) {
  try {
    debug('Trying to load dictionary', locale);

    if (!provider.availableDictionaries.includes(locale)) {
      console.warn('Dict not available', locale);

      return;
    }

    if (!provider) {
      console.warn('SpellcheckProvider not initialized');

      return;
    }

    if (locale === currentDict) {
      console.warn('Dictionary is already used', currentDict);

      return;
    }

    provider.switchDictionary(locale);

    debug('Switched dictionary to', locale);

    currentDict = locale;
    _isEnabled = true;
  } catch (err) {
    console.error(err);
  }
}

export default async function initialize(languageCode = 'en-us') {
  try {
    provider = new SpellCheckerProvider();
    const locale = languageCode.toLowerCase();

    debug('Init spellchecker');
    await provider.initialize();
    await loadDictionaries();

    debug('Available spellchecker dictionaries', provider.availableDictionaries);

    switchDict(locale);

    return provider;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function isEnabled() {
  return _isEnabled;
}

export function disable() {
  if (isEnabled()) {
    webFrame.setSpellCheckProvider(currentDict, true, { spellCheck: () => true });
    _isEnabled = false;
    currentDict = null;
  }
}
