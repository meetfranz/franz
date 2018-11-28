import { autorun, observable, reaction } from 'mobx';
import moment from 'moment';
import DelayAppComponent from './Component';

const debug = require('debug')('Franz:feature:delayApp');

const DEFAULT_DELAY_DURATION = 10000; // 10 seconds
const DEFAULT_DELAY_OFFSET = 3600000; // 1 hour
const DEFAULT_VISIBILITY = false;

export const config = {
  delayOffset: DEFAULT_DELAY_OFFSET,
  delayDuration: DEFAULT_DELAY_DURATION,
};

export const state = observable({
  isDelayAppScreenVisible: DEFAULT_VISIBILITY,
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

        config.delayOffset = globalConfig.delayOffset !== undefined ? globalConfig.delayOffset : DEFAULT_DELAY_OFFSET;
        config.delayDuration = globalConfig.wait !== undefined ? globalConfig.wait : DEFAULT_DELAY_DURATION;

        autorun(() => {
          const diff = moment().diff(timeLastDelay);
          if ((stores.app.isFocused && diff >= config.delayOffset) || !shownAfterLaunch) {
            debug(`App will be delayed for ${config.delayDuration / 1000}s`);

            setVisibility(true);

            timeLastDelay = moment();
            shownAfterLaunch = true;

            setTimeout(() => {
              debug('Resetting app delay');

              setVisibility(false);
            }, DEFAULT_DELAY_DURATION + 1000); // timer needs to be able to hit 0
          }
        });
      }
    },
  );
}

export const Component = DelayAppComponent;

