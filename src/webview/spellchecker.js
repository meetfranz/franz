import { SPELLCHECKER_LOCALES } from '../i18n/languages';

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key.toLocaleLowerCase() === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}
