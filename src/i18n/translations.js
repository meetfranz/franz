import { APP_LOCALES } from './languages';

const translations = [];
Object.keys(APP_LOCALES).forEach((key) => {
  try {
    const translation = require(`./locales/${key}.json`); // eslint-disable-line
    translations[key] = translation;
  } catch (err) {
    console.warn(`Can't find translations for ${key}`);
  }
});

module.exports = translations;
