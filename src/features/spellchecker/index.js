import { autorun, observable } from 'mobx';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

const debug = require('debug')('Franz:feature:spellchecker');

export const config = observable({
  isIncludedInCurrentPlan: DEFAULT_FEATURES_CONFIG.isSpellcheckerIncludedInCurrentPlan,
});

export default function init(stores) {
  debug('Initializing `spellchecker` feature');

  autorun(() => {
    const { isSpellcheckerIncludedInCurrentPlan } = stores.features.features;

    config.isIncludedInCurrentPlan = isSpellcheckerIncludedInCurrentPlan !== undefined ? isSpellcheckerIncludedInCurrentPlan : DEFAULT_FEATURES_CONFIG.isSpellcheckerIncludedInCurrentPlan;

    if (!stores.user.data.isPremium && !config.isIncludedInCurrentPlan && stores.settings.app.enableSpellchecking) {
      debug('Override settings.spellcheckerEnabled flag to false');

      Object.assign(stores.settings.app, {
        enableSpellchecking: false,
      });
    }
  });
}
