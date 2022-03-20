import { action, observable, computed } from 'mobx';

import { ipcRenderer } from 'electron';
import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';
import { gaEvent } from '../lib/analytics';
import { OVERLAY_OPEN } from '../ipcChannels';

export default class PaymentStore extends Store {
  @observable plansRequest = new CachedRequest(this.api.payment, 'plans');

  @observable createHostedPageRequest = new Request(this.api.payment, 'getHostedPage');

  constructor(...args) {
    super(...args);

    this.actions.payment.createHostedPage.listen(this._createHostedPage.bind(this));
    this.actions.payment.upgradeAccount.listen(this._upgradeAccount.bind(this));
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

  @action async _upgradeAccount({ planId, onCloseWindow = () => null, overrideParent = null }) {
    let hostedPageURL = this.stores.features.features.subscribeURL;

    const parsedUrl = new URL(hostedPageURL);
    const params = new URLSearchParams(parsedUrl.search.slice(1));

    params.set('plan', planId);

    hostedPageURL = this.stores.user.getAuthURL(`${parsedUrl.origin}${parsedUrl.pathname}?${params.toString()}`);

    const returnValue = await ipcRenderer.invoke(OVERLAY_OPEN, {
      route: `/payment/${encodeURIComponent(hostedPageURL)}`,
      modal: true,
      width: 800,
      overrideParent,
    });

    if (returnValue === 'closed') {
      this.stores.user.getUserInfoRequest.invalidate({ immediately: true });
      this.stores.features.featuresRequest.invalidate({ immediately: true });

      onCloseWindow();
    }
  }
}
