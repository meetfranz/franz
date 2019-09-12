import { observable, reaction } from 'mobx';
import ms from 'ms';

import { state as delayAppState } from '../delayApp';

export { default as Component } from './Component';

const debug = require('debug')('Ferdi:feature:shareFranz');

const defaultState = {
  isModalVisible: false,
  lastShown: null,
};

export const state = observable(defaultState);

export default function initialize(stores) {
  debug('Initialize shareFerdi feature');

  window.ferdi.features.shareFerdi = {
    state,
  };

  function showModal() {
    debug('Would have showed share window');

    // state.isModalVisible = true;
  }

  reaction(
    () => stores.user.isLoggedIn,
    () => {
      setTimeout(() => {
        if (stores.settings.stats.appStarts % 50 === 0) {
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
