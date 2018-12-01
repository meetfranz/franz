import { autorun, reaction } from 'mobx';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

const debug = require('debug')('Franz:feature:spellchecker');

export const config = {
  isPremiumFeature: DEFAULT_FEATURES_CONFIG.isSpellcheckerPremiumFeature,
};

export default function init(stores) {
  reaction(
    () => stores.features.features.isSpellcheckerPremiumFeature,
    (enabled, r) => {
      debug('Initializing `spellchecker` feature');

      // Dispose the reaction to run this only once
      r.dispose();

      const { isSpellcheckerPremiumFeature } = stores.features.features;

      config.isPremiumFeature = isSpellcheckerPremiumFeature !== undefined ? isSpellcheckerPremiumFeature : DEFAULT_FEATURES_CONFIG.isSpellcheckerPremiumFeature;

      autorun(() => {
        if (!stores.user.data.isPremium && config.isPremiumFeature) {
          debug('Override settings.spellcheckerEnabled flag to false');

          Object.assign(stores.settings.all.app, {
            enableSpellchecking: false,
          });
        }
      });
    },
  );
}

