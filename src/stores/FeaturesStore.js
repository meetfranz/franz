import { action, computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

export default class RecipesStore extends Store {
  @observable baseFeaturesRequest = new CachedRequest(this.api.features, 'base');
  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  setup() {
    this.registerReactions([
      this._monitorLoginStatus.bind(this),
      this._debugFeatures.bind(this),
    ]);
  }

  @computed get base() {
    return this.baseFeaturesRequest.execute().result || {};
  }

  @computed get features() {
    if (this.stores.user.isLoggedIn) {
      return this.featuresRequest.execute().result || {};
    }

    return this.base;
  }

  _debugFeatures() {
    console.log(this.base, this.features)
  }

  _monitorLoginStatus() {
    if (this.stores.user.isLoggedIn) {
      this.featuresRequest.invalidate({ immediately: true });
      this.featuresRequest.execute();
    } else {
      this.baseFeaturesRequest.invalidate({ immediately: true });
      this.baseFeaturesRequest.execute();
    }
  }
}
