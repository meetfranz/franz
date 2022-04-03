import { autorun, observable, reaction } from 'mobx';
import moment from 'moment';
import { ipcRenderer } from 'electron';
import DelayAppComponent from './Component';

import { DEFAULT_FEATURES_CONFIG } from '../../config';
import { gaEvent, gaPage } from '../../lib/analytics';
import { getUserWorkspacesRequest } from '../workspaces/api';
import { getPoweredByRequest } from './api';
import { DelayAppStore } from './store';
import { RESIZE_SERVICE_VIEWS } from '../../ipcChannels';

const debug = require('debug')('Franz:feature:delayApp');

export const store = new DelayAppStore();

export const config = {
  delayOffset: DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.delayOffset,
  delayDuration: DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait,
};

export const state = observable({
  isDelayAppScreenVisible: DEFAULT_FEATURES_CONFIG.needToWaitToProceed,
});

let shownAfterLaunch = false;
let timeLastDelay = moment();

function setVisibility(isDelayAppScreenVisible) {
  Object.assign(state, {
    isDelayAppScreenVisible,
  });

  if (isDelayAppScreenVisible) {
    ipcRenderer.send(RESIZE_SERVICE_VIEWS, {
      width: 0,
    });
  }
}

export function resetAppDelay() {
  debug('Resetting app delay, shownAfterLaunch:', shownAfterLaunch);

  shownAfterLaunch = true;
  timeLastDelay = moment();
  setVisibility(false);
  getPoweredByRequest.invalidate({ immediately: true });
}

export default function init(stores) {
  debug('Initializing `delayApp` feature');

  window.franz.features.delayApp = {
    state,
  };

  reaction(
    () => (
      stores.user.isLoggedIn
      && stores.services.allServicesRequest.wasExecuted
      && getUserWorkspacesRequest.wasExecuted
      && stores.features.features.needToWaitToProceed
      && !stores.user.data.isPremium
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Enabling `delayApp` feature');

        const { needToWaitToProceedConfig: globalConfig } = stores.features.features;

        config.delayOffset = globalConfig.delayOffset !== undefined ? globalConfig.delayOffset : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.delayOffset;
        config.delayDuration = globalConfig.wait !== undefined ? globalConfig.wait : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait;

        autorun(() => {
          const { isAnnouncementShown } = stores.announcements;
          if (stores.services.allDisplayed.length === 0 || isAnnouncementShown) {
            debug('Skipping delay app as allDisplayed services is either 0 or announcement is shown');
            shownAfterLaunch = true;
            setVisibility(false);
            return;
          }

          const diff = moment().diff(timeLastDelay);
          const itsTimeToWait = diff >= config.delayOffset;
          debug(`isAnnouncementShown: ${isAnnouncementShown}, stores.app.isFocused: ${stores.app.isFocused}, shownAfterLaunch: ${shownAfterLaunch}`);
          if (!isAnnouncementShown && ((stores.app.isFocused && itsTimeToWait) || !shownAfterLaunch)) {
            debug(`App will be delayed for ${config.delayDuration / 1000}s`);

            setVisibility(true);
            gaPage('/delayApp');
            gaEvent('DelayApp', 'show', 'Delay App Feature');

            debug(`Showing ad: ${store.poweredBy.id}`);
            gaEvent('PoweredBy', 'show', store.poweredBy.id);

            if (!globalConfig.needToClick) {
              setTimeout(() => {
                resetAppDelay();
              }, config.delayDuration + 1000); // timer needs to be able to hit 0
            }
          } else {
            debug('Set visibility to', false);
            setVisibility(false);
          }
        });
      } else {
        setVisibility(false);
      }
    },
  );
}

export const Component = DelayAppComponent;
