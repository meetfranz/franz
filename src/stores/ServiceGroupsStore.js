// import { remote } from 'electron';
import { action, computed, observable } from 'mobx';
import { debounce, remove } from 'lodash';
// import path from 'path';
// import fs from 'fs-extra';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { matchRoute } from '../helpers/routing-helpers';
import { gaEvent } from '../lib/analytics';

export default class ServiceGroupsStore extends Store {
  @observable allServiceGroupsRequest = new CachedRequest(this.api.serviceGroups, 'all');
  @observable createServiceGroupRequest = new Request(this.api.serviceGroups, 'create');
  @observable updateServiceGroupRequest = new Request(this.api.serviceGroups, 'update');
  @observable reorderServiceGroupsRequest = new Request(this.api.serviceGroups, 'reorder');
  @observable deleteServiceGroupRequest = new Request(this.api.serviceGroups, 'delete');

  @observable filterNeedle = null;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.serviceGroup.createServiceGroup.listen(this._createServiceGroup.bind(this));
    this.actions.serviceGroup.updateServiceGroup.listen(this._updateServiceGroup.bind(this));
    this.actions.serviceGroup.deleteServiceGroup.listen(this._deleteServiceGroup.bind(this));
    this.actions.serviceGroup.reorder.listen(this._reorder.bind(this));

    this.registerReactions([
    ]);
  }

  @computed get all() {
    if (this.stores.user.isLoggedIn) {
      const serviceGroups = this.allServiceGroupsRequest.execute().result;
      if (serviceGroups) {
        return observable(serviceGroups);//.slice().slice().sort((a, b) => a.order - b.order));
      }
    }

    return [];
  }

  one(id) {
    return this.all.find(serviceGroup => serviceGroup.id === id);
  }

  // Actions
  @action async _createServiceGroup({ serviceGroupData, redirect }) {
    const response = await this.createServiceGroupRequest.execute(serviceGroupData)._promise;

    this.allServiceGroupsRequest.patch((result) => {
      if (!result) return;
      result.push(response.data);
    });

    this.actionStatus = response.status || [];

    if (redirect) {
      this.stores.router.push('/settings/services');
      gaEvent('Service Group', 'create');
    }
  }

  @action async _updateServiceGroup({ serviceGroupId, serviceGroupData, redirect }) {
    const service = this.one(serviceId);
    const request = this.updateServiceRequest.execute(serviceId, data);

    this.allServicesRequest.patch((result) => {
      if (!result) return;

      Object.assign(result.find(c => c.id === serviceId), newData);
    });

    await request._promise;
    this.actionStatus = request.result.status;

    if (redirect) {
      this.stores.router.push('/settings/services');
      gaEvent('Service', 'update', service.recipe.id);
    }
  }

  @action async _deleteServiceGroup({ serviceGroupId, redirect }) {
    const request = this.deleteServiceGroupRequest.execute(serviceGroupId);

    if (redirect) {
      this.stores.router.push(redirect);
    }

    this.allServiceGroupsRequest.patch((result) => {
      remove(result, c => c.id === serviceGroupId);
    });

    await request._promise;
    this.actionStatus = request.result.status;

    gaEvent('Service Group', 'delete');
  }

  @action _reorder() {
    const serviceGroups = {};
    this.all.forEach((serviceGroup) => {
      serviceGroups[serviceGroup.id] = serviceGroup.order;
    });
    this.reorderServiceGroupsRequest.execute(serviceGroups);
    // this.allServiceGroupsRequest.patch((data) => {
    //   data.forEach((s) => {
    //     const service = s;

    //     service.order = services[s.id];
    //   });
    // });

    // this._reorderAnalytics();
  }

  @action _setUnreadMessageCount({ serviceId, count }) {
    const service = this.one(serviceId);

    service.unreadDirectMessageCount = count.direct;
    service.unreadIndirectMessageCount = count.indirect;
  }

  @action _toggleNotifications({ serviceId }) {
    const service = this.one(serviceId);

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isNotificationEnabled: !service.isNotificationEnabled,
      },
      redirect: false,
    });
  }

  @action _toggleAudio({ serviceId }) {
    const service = this.one(serviceId);

    service.isNotificationEnabled = !service.isNotificationEnabled;

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isMuted: !service.isMuted,
      },
      redirect: false,
    });
  }

  _getUnreadMessageCountReaction() {
    const showMessageBadgeWhenMuted = this.stores.settings.all.showMessageBadgeWhenMuted;
    const showMessageBadgesEvenWhenMuted = this.stores.ui.showMessageBadgesEvenWhenMuted;

    const unreadDirectMessageCount = this.allDisplayed
      .filter(s => (showMessageBadgeWhenMuted || s.isNotificationEnabled) && showMessageBadgesEvenWhenMuted && s.isBadgeEnabled)
      .map(s => s.unreadDirectMessageCount)
      .reduce((a, b) => a + b, 0);

    const unreadIndirectMessageCount = this.allDisplayed
      .filter(s => (showMessageBadgeWhenMuted && showMessageBadgesEvenWhenMuted) && (s.isBadgeEnabled && s.isIndirectMessageBadgeEnabled))
      .map(s => s.unreadIndirectMessageCount)
      .reduce((a, b) => a + b, 0);

    // We can't just block this earlier, otherwise the mobx reaction won't be aware of the vars to watch in some cases
    if (showMessageBadgesEvenWhenMuted) {
      this.actions.app.setBadge({
        unreadDirectMessageCount,
        unreadIndirectMessageCount,
      });
    }
  }

  // Helper
  _redirectToAddServiceRoute(recipeId) {
    const route = `/settings/services/add/${recipeId}`;
    this.stores.router.push(route);
  }

  _reorderAnalytics = debounce(() => {
    gaEvent('Service Group', 'order');
  }, 5000);

}
