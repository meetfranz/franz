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
    // const serviceGroups = this.stores.serviceGroups.all;
    const services = this.stores.services.all;

    const groupServiceMapping = {};
    services.forEach((service) => {
      if (groupServiceMapping[service.groupId] === undefined) {
        let group = this.stores.serviceGroups.one(service.groupId);
        if (group === undefined) {
          group = new ServiceGroup({ name: 'Uncategorized' });
        }
        // console.log(group)
        groupServiceMapping[service.groupId] = {
          group,
          services: [],
        };
      }
      groupServiceMapping[service.groupId].services.push(service);
    });
    const groups = _.values(groupServiceMapping);
    // console.log(groups)


    // serviceGroups.forEach((serviceGroup) => {
    //   groups.push(serviceGroup);
    // });

    return groups;
  }
}
