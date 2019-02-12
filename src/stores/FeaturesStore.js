import { computed, observable, reaction } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';

import delayApp from '../features/delayApp';
import spellchecker from '../features/spellchecker';
import serviceProxy from '../features/serviceProxy';
import basicAuth from '../features/basicAuth';

import { DEFAULT_FEATURES_CONFIG } from '../config';

export default class FeaturesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'default');

  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  async setup() {
    this.registerReactions([
      this._monitorLoginStatus.bind(this),
    ]);

    await this.featuresRequest._promise;
    setTimeout(this._enableFeatures.bind(this), 1);

    // single key reaction
    reaction(() => this.stores.user.data.isPremium, () => {
      if (this.stores.user.isLoggedIn) {
        this.featuresRequest.invalidate({ immediately: true });
      }
    });
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

  _monitorLoginStatus() {
    if (this.stores.user.isLoggedIn) {
      this.featuresRequest.invalidate({ immediately: true });
    } else {
      this.defaultFeaturesRequest.invalidate({ immediately: true });
    }
  }

  _enableFeatures() {
    delayApp(this.stores, this.actions);
    spellchecker(this.stores, this.actions);
    serviceProxy(this.stores, this.actions);
    basicAuth(this.stores, this.actions);
  }
}
