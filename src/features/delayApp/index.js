import { autorun, observable, reaction } from 'mobx';
import moment from 'moment';
import DelayAppComponent from './Component';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

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
  reaction(
    () => stores.features.features.needToWaitToProceed,
    (enabled, r) => {
      if (enabled) {
        debug('Initializing `delayApp` feature');

        // Dispose the reaction to run this only once
        r.dispose();

        const { needToWaitToProceedConfig: globalConfig } = stores.features.features;

        let shownAfterLaunch = false;
        let timeLastDelay = moment();

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

            timeLastDelay = moment();
            shownAfterLaunch = true;

            setTimeout(() => {
              debug('Resetting app delay');

              setVisibility(false);
            }, DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait + 1000); // timer needs to be able to hit 0
          }
        });
      }
    },
  );
}

export const Component = DelayAppComponent;
