import { observable, reaction } from 'mobx';
import ms from 'ms';

import { state as delayAppState } from '../delayApp';
import { gaEvent, gaPage } from '../../lib/analytics';

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

  function showModal() {
    debug('Showing share window');

    state.isModalVisible = true;

    gaEvent('Share Franz', 'show');
    gaPage('/share-modal');
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
