import { computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';

import spellchecker from '../features/spellchecker';
import serviceProxy from '../features/serviceProxy';
import basicAuth from '../features/basicAuth';
import shareFranz from '../features/shareFranz';

import { DEFAULT_FEATURES_CONFIG } from '../config';

export default class FeaturesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'default');

  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  setup() {
    this.registerReactions([
      this._monitorLoginStatus.bind(this),
      this._debugFeatures.bind(this),
    ]);
  }

  @computed get anonymousFeatures() {
    return this.defaultFeaturesRequest.execute().result || DEFAULT_FEATURES_CONFIG;
  }

  @computed get features() {
    if (this.stores.user.isLoggedIn) {
      return this.featuresRequest.execute().result || DEFAULT_FEATURES_CONFIG;
    }

    return DEFAULT_FEATURES_CONFIG;
  }

  _debugFeatures() {
  }

  _monitorLoginStatus() {
    if (this.stores.user.isLoggedIn) {
      this.featuresRequest.invalidate({ immediately: true });
    } else {
      this.defaultFeaturesRequest.invalidate({ immediately: true });
    }
  }

  _enableFeatures() {
    spellchecker(this.stores, this.actions);
    serviceProxy(this.stores, this.actions);
    basicAuth(this.stores, this.actions);
    shareFranz(this.stores, this.actions);
  }
}
