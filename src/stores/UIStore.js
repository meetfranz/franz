import { action, observable, computed } from 'mobx';
import _ from 'lodash';

import Store from './lib/Store';
import ServiceGroup from '../models/ServiceGroup';

export default class UIStore extends Store {
  @observable showServicesUpdatedInfoBar = false;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.ui.openSettings.listen(this._openSettings.bind(this));
    this.actions.ui.closeSettings.listen(this._closeSettings.bind(this));
    this.actions.ui.toggleServiceUpdatedInfoBar.listen(this._toggleServiceUpdatedInfoBar.bind(this));
    // this.actions.ui.reorderServiceStructure.listen(this._reorderServiceStructure.bind(this));
  }

  @computed get showMessageBadgesEvenWhenMuted() {
    const settings = this.stores.settings.all;

    return (settings.isAppMuted && settings.showMessageBadgeWhenMuted) || !settings.isAppMuted;
  }

  // Actions
  @action _openSettings({ path = '/settings' }) {
    const settingsPath = path !== '/settings' ? `/settings/${path}` : path;
    this.stores.router.push(settingsPath);
  }

  @action _closeSettings(): void {
    this.stores.router.push('/');
  }

  @action _toggleServiceUpdatedInfoBar({ visible }) {
    let visibility = visible;
    if (visibility === null) {
      visibility = !this.showServicesUpdatedInfoBar;
    }
    this.showServicesUpdatedInfoBar = visibility;
  }

  @computed get serviceGroupStructure() {
    const serviceGroups = this.stores.serviceGroups.all;
    const services = this.stores.services.all;

    serviceGroups.forEach((serviceGroup) => {
      serviceGroup.services = [];
    });

    const groups = [];
    services.forEach((service) => {
      // console.log(service.order, service.groupId);
      if (service.groupId === undefined || service.groupId === '') {
        groups[service.order] = {
          type: 'root',
          group: new ServiceGroup({ name: 'Uncategorized' }),
          services: [service],
        };
        return;
      }

      const group = this.stores.serviceGroups.one(service.groupId);
      if (group === undefined) {
        console.warn('no group associated with id', service.groupId);
        return;
      }
      group.services[service.order] = service;
      groups[group.order] = {
        type: 'group',
        group,
        services: group.services,
      };
    });

    // add empty groups
    serviceGroups.forEach((serviceGroup) => {
      // console.log(serviceGroup.name, serviceGroup.services.length)
      if (serviceGroup.services.length === 0) {
        groups[serviceGroup.order] = {
          type: 'group',
          group: serviceGroup,
          services: [],
        };
      }
    });
    
    return groups;
  }

  // _reorderServiceStructure({ newListIndex, newIndex, items }) {
  //   const structure = this.serviceGroupStructure;
  //   console.log(this.serviceGroupStructure);

  //   switch (structure[newListIndex].type) {
  //     case 'root':
  //       break;
  //     case 'group':
  //       break;
  //     default:
  //   }
  // }
}
