import { computed, observable } from 'mobx';
import { FeatureStore } from '../utils/FeatureStore';
import { DEFAULT_SERVICE_LIMIT } from '.';

const debug = require('debug')('Franz:feature:serviceLimit:store');

export class ServiceLimitStore extends FeatureStore {
  @observable isServiceLimitEnabled = false;

  start(stores, actions) {
    debug('start');
    this.stores = stores;
    this.actions = actions;

    this.isServiceLimitEnabled = true;
  }

  stop() {
    super.stop();

    this.isServiceLimitEnabled = false;
  }

  @computed get userHasReachedServiceLimit() {
    if (!this.isServiceLimitEnabled) return false;

    const { user } = this.stores;

    return !user.isPremium && this.serviceCount >= this.serviceLimit;
  }

  @computed get serviceLimit() {
    return this.stores.features.features.serviceLimitCount || DEFAULT_SERVICE_LIMIT;
  }

  @computed get serviceCount() {
    return this.stores.services.all.length;
  }
}

export default ServiceLimitStore;
