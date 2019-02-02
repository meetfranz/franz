import { action, computed, observable } from 'mobx';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

import Store from './lib/Store';

export default class PaymentStore extends Store {
  @observable plansRequest = new CachedRequest(this.api.payment, 'plans');

  @observable createHostedPageRequest = new Request(this.api.payment, 'getHostedPage');

  @observable createDashboardUrlRequest = new Request(this.api.payment, 'getDashboardUrl');

  @observable ordersDataRequest = new CachedRequest(this.api.payment, 'getOrders');

  constructor(...args) {
    super(...args);

    this.actions.payment.createHostedPage.listen(this._createHostedPage.bind(this));
    this.actions.payment.createDashboardUrl.listen(this._createDashboardUrl.bind(this));
  }

  @computed get plan() {
    if (this.plansRequest.isError) {
      return {};
    }
    return this.plansRequest.execute().result || {};
  }

  @computed get orders() {
    return this.ordersDataRequest.execute().result || [];
  }

  @action _createHostedPage({ planId }) {
    return this.createHostedPageRequest.execute(planId);
  }

  @action _createDashboardUrl() {
    return this.createDashboardUrlRequest.execute();
  }
}
