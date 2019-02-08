import { defineMessages } from 'react-intl';

export default defineMessages({
  upgradeAccount: {
    id: 'global.premium.upgradeAccount',
    defaultMessage: '!!!Please upgrade your account to add a new service.',
  },
  APIUnhealthy: {
    id: 'global.api.unhealthy',
    defaultMessage: '!!!Can\'t connect to Franz Online Services',
  },
  notConnectedToTheInternet: {
    id: 'global.notConnectedToTheInternet',
    defaultMessage: '!!!You are not connected to the internet.',
  },
  spellcheckerLanguage: {
    id: 'global.spellchecking.language',
    defaultMessage: '!!!Spell checking language',
  },
  spellcheckerSystemDefault: {
    id: 'global.spellchecker.useDefault',
    defaultMessage: '!!!Use System Default ({default})',
  },
  spellcheckerAutomaticDetection: {
    id: 'global.spellchecking.autodetect',
    defaultMessage: '!!!Detect language automatically',
  },
  spellcheckerAutomaticDetectionShort: {
    id: 'global.spellchecking.autodetect.short',
    defaultMessage: '!!!Automatic',
  },
});
