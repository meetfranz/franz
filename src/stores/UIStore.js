import { action, observable, computed } from 'mobx';

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
    this.actions.ui.reorderServiceStructure.listen(this._reorderServiceStructure.bind(this));
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

  @action _closeSettings() {
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
    const services = this.stores.services.filtered;

    serviceGroups.forEach((sg) => {
      const serviceGroup = sg;
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
        // console.warn('no group associated with id', service.groupId);
        return;
      }
      group.services[service.order] = service;
      groups[group.order] = {
        type: 'group',
        group,
        services: group.services,
      };
    });

    // add empty groups (no services yet)
    serviceGroups.forEach((serviceGroup) => {
      // console.log(serviceGroup.name, serviceGroup.services.length)
      if (serviceGroup.services.length === 0 && this.stores.services.filterNeedle === null) {
        groups[serviceGroup.order] = {
          type: 'group',
          group: serviceGroup,
          services: [],
        };
      }
    });

    // pad groups with root-level placeholder groups
    const paddedGroups = [];
    if (groups[0] && groups[0].type === 'group') {
      paddedGroups.push({
        type: 'root',
        group: new ServiceGroup({ name: 'Uncategorized' }),
        services: [],
      });
    }
    groups.forEach((group, index) => {
      paddedGroups.push(group);
      if (group.type === 'group' &&
        ((groups[index + 1] && groups[index + 1].type === 'group') ||
        !groups[index + 1])) {
        paddedGroups.push({
          type: 'root',
          group: new ServiceGroup({ name: 'Uncategorized' }),
          services: [],
        });
      }
    });

    return paddedGroups;
  }

  @action _reorderServiceStructure({ structure }) {
    const groups = this._removePadding(structure);
    groups.forEach((g, index) => {
      const group = g;
      switch (group.type) {
        case 'root':
          group.services[0].order = index;
          // console.log(group.services[0].name, group.services[0].order, group.services[0].groupId)
          break;
        case 'group':
          group.group.order = index;
          group.services.forEach((s, i) => {
            const service = s;
            service.order = i;
            // console.log(service.name, service.order, service.groupId)
          });
          break;
        default:
      }
    });
    this.actions.service.reorder();
    this.actions.serviceGroup.reorder();
  }

  _removePadding(structure) {
    const groups = [];
    // remove empty (padding) 'root' groups
    structure.forEach((group) => {
      if (group && group.type === 'root' && group.services && group.services.length === 0) {
        return;
      }
      groups.push(group);
    });
    return groups;
  }

  get nextServiceGroupOrder() {
    return this._removePadding(this.serviceGroupStructure).length;
  }
}
