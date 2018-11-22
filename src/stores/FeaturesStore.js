import { computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';

export default class FeaturesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'default');
  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  setup() {
    this.registerReactions([
      this._monitorLoginStatus.bind(this),
      this._debugFeatures.bind(this),
    ]);
  }

  @computed get features() {
    if (this.stores.user.isLoggedIn) {
      return this.featuresRequest.execute().result || {};
    }

    return this.defaultFeaturesRequest.execute().result || {};
  }

  _debugFeatures() {
    console.log(this.features);
  }

  _monitorLoginStatus() {
    if (this.stores.user.isLoggedIn) {
      this.featuresRequest.invalidate({ immediately: true });
    } else {
      this.defaultFeaturesRequest.invalidate({ immediately: true });
    }
  }
}
