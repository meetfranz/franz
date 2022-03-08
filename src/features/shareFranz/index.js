import { observable, reaction } from 'mobx';
import ms from 'ms';

import { ipcRenderer } from 'electron';
import { state as delayAppState } from '../delayApp';
import { gaEvent, gaPage } from '../../lib/analytics';
import { OVERLAY_OPEN, SHARE_FRANZ_GET_SERVICE_COUNT } from '../../ipcChannels';
import { planSelectionStore } from '../planSelection';

export { default as Component } from './Component';

const debug = require('debug')('Franz:feature:shareFranz');

const defaultState = {
  isModalVisible: false,
  lastShown: null,
};

export const state = observable(defaultState);

export default function initialize(stores) {
  debug('Initialize shareFranz feature');

  window.franz.features.shareFranz = {
    state,
  };

  ipcRenderer.on(SHARE_FRANZ_GET_SERVICE_COUNT, (event) => {
    ipcRenderer.sendTo(event.senderId, SHARE_FRANZ_GET_SERVICE_COUNT, { serviceCount: stores.services.all.length });
  });

  function showModal() {
    debug('Showing share window');

    state.isModalVisible = true;

    // insert ipc event here
    ipcRenderer.invoke(OVERLAY_OPEN, {
      route: '/share-franz', width: 800, height: 400, modal: true,
    });

    gaEvent('Share Franz', 'show');
    gaPage('/share-modal');
  }

  reaction(
    () => stores.user.isLoggedIn,
    () => {
      setTimeout(() => {
        if (stores.settings.stats.appStarts % 50 === 0 && !planSelectionStore.showPlanSelectionOverlay) {
          if (delayAppState.isDelayAppScreenVisible) {
            debug('Delaying share modal by 5 minutes');
            setTimeout(() => showModal(), ms('5m'));
          } else {
            showModal();
          }
        }
      }, ms('2s'));
    },
    {
      fireImmediately: true,
    },
  );
}
