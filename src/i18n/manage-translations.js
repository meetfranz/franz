require('@babel/register');
const manageTranslations = require('react-intl-translations-manager').default;
// const { APP_LOCALES } = require('../src/i18n/languages');

manageTranslations({
  messagesDirectory: 'src/i18n/messages',
  translationsDirectory: 'src/i18n/locales',
  singleMessagesFile: true,
  languages: ['en-US'], // Object.keys(APP_LOCALES),
});
