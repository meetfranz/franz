import { action, observable, computed } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';
import { gaEvent } from '../lib/analytics';

export default class PaymentStore extends Store {
  @observable plansRequest = new CachedRequest(this.api.payment, 'plans');

  @observable createHostedPageRequest = new Request(this.api.payment, 'getHostedPage');

  constructor(...args) {
    super(...args);

    this.actions.payment.createHostedPage.listen(this._createHostedPage.bind(this));
  }

  @computed get plan() {
    if (this.plansRequest.isError) {
      return {};
    }
    return this.plansRequest.execute().result || {};
  }

  @action _createHostedPage({ planId }) {
    const request = this.createHostedPageRequest.execute(planId);

    gaEvent('Payment', 'createHostedPage', planId);

    return request;
  }
}
