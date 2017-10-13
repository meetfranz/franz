import languages from './languages';

const translations = [];
Object.keys(languages).forEach((key) => {
  try {
    const translation = require(`./locales/${key}.json`); // eslint-disable-line
    translations[key] = translation;
  } catch (err) {
    console.warn(`Can't find translations for ${key}`);
  }
});

module.exports = translations;
