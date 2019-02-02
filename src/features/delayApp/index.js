import { autorun, observable, reaction } from 'mobx';
import moment from 'moment';
import DelayAppComponent from './Component';

import { DEFAULT_FEATURES_CONFIG } from '../../config';
import { gaEvent } from '../../lib/analytics';

const debug = require('debug')('Franz:feature:delayApp');

export const config = {
  delayOffset: DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.delayOffset,
  delayDuration: DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait,
};

export const state = observable({
  isDelayAppScreenVisible: DEFAULT_FEATURES_CONFIG.needToWaitToProceed,
});

function setVisibility(value) {
  Object.assign(state, {
    isDelayAppScreenVisible: value,
  });
}

export default function init(stores) {
  debug('Initializing `delayApp` feature');

  let shownAfterLaunch = false;
  let timeLastDelay = moment();

  reaction(
    () => stores.features.features.needToWaitToProceed && !stores.user.data.isPremium,
    (isEnabled) => {
      if (isEnabled) {
        debug('Enabling `delayApp` feature');

        const { needToWaitToProceedConfig: globalConfig } = stores.features.features;

        config.delayOffset = globalConfig.delayOffset !== undefined ? globalConfig.delayOffset : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.delayOffset;
        config.delayDuration = globalConfig.wait !== undefined ? globalConfig.wait : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait;

        autorun(() => {
          if (stores.services.all.length === 0) {
            shownAfterLaunch = true;
            return;
          }

          const diff = moment().diff(timeLastDelay);
          if ((stores.app.isFocused && diff >= config.delayOffset) || !shownAfterLaunch) {
            debug(`App will be delayed for ${config.delayDuration / 1000}s`);

            setVisibility(true);
            gaEvent('delayApp', 'show', 'Delay App Feature');

            timeLastDelay = moment();
            shownAfterLaunch = true;

            setTimeout(() => {
              debug('Resetting app delay');

              setVisibility(false);
            }, DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait + 1000); // timer needs to be able to hit 0
          }
        });
      } else {
        setVisibility(false);
      }
    },
  );
}

export const Component = DelayAppComponent;
