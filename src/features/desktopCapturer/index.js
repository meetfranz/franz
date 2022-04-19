import { observable } from 'mobx';

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
}
