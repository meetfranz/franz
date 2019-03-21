import { observable, reaction } from 'mobx';
import ms from 'ms';

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
  }

  reaction(
    () => stores.user.isLoggedIn,
    () => {
      setTimeout(() => {
        if (stores.settings.stats.appStarts % 30 === 0) {
          showModal();
        }
      }, ms('2s'));
    },
    {
      fireImmediately: true,
    },
  );
}
