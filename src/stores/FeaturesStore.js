import { action, computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

export default class RecipesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'defaults');

  setup() {
    return this.defaults;
  }

  @computed get defaults() {
    console.log('GETTING DEFAULTS')
    return this.defaultFeaturesRequest.execute().result || [];
  }
}
