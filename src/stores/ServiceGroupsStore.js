import { action, computed, observable } from 'mobx';
import { debounce, remove } from 'lodash';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
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
        return observable(serviceGroups);
      }
    }

    return [];
  }

  one(id) {
    return this.all.find(serviceGroup => serviceGroup.id === id);
  }

  // Actions
  @action async _createServiceGroup({ serviceGroupData, redirect }) {
    console.log(serviceGroupData)
    const response = await this.createServiceGroupRequest.execute(serviceGroupData)._promise;

    this.allServiceGroupsRequest.patch((result) => {
      if (!result) return;
      result.push(response.data);
    });

    this.actionStatus = response.status || [];

    if (redirect) {
      this.stores.router.push('/settings/services');
    }

    gaEvent('Service Group', 'create');
  }

  @action async _updateServiceGroup({ serviceGroupId, serviceGroupData }) {
    const request = this.updateServiceGroupRequest.execute(serviceGroupId, serviceGroupData);

    this.allServiceGroupsRequest.patch((result) => {
      if (!result) return;

      Object.assign(result.find(c => c.id === serviceGroupId), serviceGroupData);
    });

    await request._promise;
    this.actionStatus = request.result.status;

    gaEvent('Service Group', 'update');    
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
    //   data.forEach((sg) => {
    //     const serviceGroup = sg;

    //     serviceGroup.order = serviceGroups[serviceGroup.id];
    //   });
    // });

    this._reorderAnalytics();
  }

  // Helper
  _reorderAnalytics = debounce(() => {
    gaEvent('Service Group', 'order');
  }, 5000);
}
