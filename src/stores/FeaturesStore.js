import { computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';

import delayApp from '../features/delayApp';

export default class FeaturesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'default');
  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  async setup() {
    this.registerReactions([
      this._monitorLoginStatus.bind(this),
    ]);

    await this.featuresRequest._promise;
    setTimeout(this._enableFeatures.bind(this), 1);
  }

  @computed get features() {
    if (this.stores.user.isLoggedIn) {
      return this.featuresRequest.execute().result || {};
    }

    return this.defaultFeaturesRequest.execute().result || {};
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
  }
}
