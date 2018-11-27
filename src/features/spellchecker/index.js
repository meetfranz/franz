import { autorun, reaction } from 'mobx';

const debug = require('debug')('Franz:feature:spellchecker');

const DEFAULT_IS_PREMIUM_FEATURE = true;

export const config = {
  isPremiumFeature: DEFAULT_IS_PREMIUM_FEATURE,
};

export default function init(stores) {
  reaction(
    () => stores.features.features.isSpellcheckerPremiumFeature,
    (enabled, r) => {
      if (enabled) {
        debug('Initializing `spellchecker` feature');

        // Dispose the reaction to run this only once
        r.dispose();

        const { isSpellcheckerPremiumFeature } = stores.features.features;

        config.isPremiumFeature = isSpellcheckerPremiumFeature !== undefined ? isSpellcheckerPremiumFeature : DEFAULT_IS_PREMIUM_FEATURE;

        autorun(() => {
          if (!stores.user.data.isPremium && config.isPremiumFeature) {
            debug('Override settings.spellcheckerEnabled flag to false');

            Object.assign(stores.settings.all.app, {
              enableSpellchecker: false,
            });
          }
        });
      }
    },
  );
}

