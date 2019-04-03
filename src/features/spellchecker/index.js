import { autorun, observable } from 'mobx';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

const debug = require('debug')('Franz:feature:spellchecker');

export const config = observable({
  isPremium: DEFAULT_FEATURES_CONFIG.isSpellcheckerPremiumFeature,
});

export default function init(stores) {
  debug('Initializing `spellchecker` feature');

  autorun(() => {
    const { isSpellcheckerPremiumFeature } = stores.features.features;

    config.isPremium = isSpellcheckerPremiumFeature !== undefined ? isSpellcheckerPremiumFeature : DEFAULT_FEATURES_CONFIG.isSpellcheckerPremiumFeature;

    if (!stores.user.data.isPremium && config.isPremium && stores.settings.app.enableSpellchecking) {
      debug('Override settings.spellcheckerEnabled flag to false');

      Object.assign(stores.settings.app, {
        enableSpellchecking: false,
      });
    }
  });
}
