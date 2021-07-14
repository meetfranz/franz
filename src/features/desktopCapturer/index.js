import { observable } from 'mobx';

// import { gaEvent, gaPage } from '../../lib/analytics';

export { default as Component } from './Component';

const debug = require('debug')('Franz:feature:desktopCapturer');

const defaultState = {
  isModalVisible: false,
  sources: [],
  selectedSource: null,
  webview: null,
};

export const state = observable(defaultState);

export default function initialize() {
  debug('Initialize shareFranz feature');

  window.franz.features.desktopCapturer = {
    state,
  };

  // reaction(
  //   () => stores.user.isLoggedIn,
  //   () => {
  //     // setTimeout(() => {
  //     //   if (stores.settings.stats.appStarts % 50 === 0 && !planSelectionStore.showPlanSelectionOverlay) {
  //     //     if (delayAppState.isDelayAppScreenVisible) {
  //     //       debug('Delaying share modal by 5 minutes');
  //     //       setTimeout(() => showModal(), ms('5m'));
  //     //     } else {
  //     // showModal();
  //     // }
  //     // }
  //     // }, ms('2s'));
  //   },
  //   {
  //     fireImmediately: true,
  //   },
  // );
}

export function showModal(webview) {
  debug('Showing desktop capture modal');

  Object.assign(state, defaultState, {
    isModalVisible: true,
    webview,
  });
  // gaEvent('Share Franz', 'show');
  // gaPage('/share-modal');
}

export function closeModal() {
  debug('Closing desktop capture modal');
  state.webview.send('feature:desktopCapturer:cancelSelectSource');

  Object.assign(state, defaultState);

  // gaEvent('Share Franz', 'show');
  // gaPage('/share-modal');
}

export function shareSourceWithClientWebview() {
  console.log('share', state.webview, state.selectedSource);
  if (state.webview && state.selectedSource) {
    state.webview.send('feature:desktopCapturer:setSelectSource', {
      sourceId: state.selectedSource,
    });
  }
}
