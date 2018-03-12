import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

// import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import UserStore from '../../stores/UserStore';
import ServiceStore from '../../stores/ServicesStore';
import ServiceGroupsStore from '../../stores/ServiceGroupsStore';
import ServiceGroup from '../../models/ServiceGroup';
import { gaPage } from '../../lib/analytics';

import ServicesDashboard from '../../components/settings/services/ServicesDashboard';

@inject('stores', 'actions') @observer
export default class ServicesScreen extends Component {
  constructor() {
    super();
    this.createServiceGroup = this.createServiceGroup.bind(this);
    this.deleteServiceGroup = this.deleteServiceGroup.bind(this);
  }

  componentDidMount() {
    gaPage('Settings/Service Dashboard');
  }

  componentWillUnmount() {
    this.props.actions.service.resetFilter();
    this.props.actions.service.resetStatus();
  }

  deleteService() {
    this.props.actions.service.deleteService();
    this.props.stores.services.resetFilter();
  }

  createServiceGroup(name) {
    this.props.actions.serviceGroup.createServiceGroup({
      serviceGroupData: {
        name,
      },
    });
  }

  deleteServiceGroup(serviceGroupId) {
    this.props.actions.serviceGroup.deleteServiceGroup({
      serviceGroupId,
    });
  }

  render() {
    const { user, services, serviceGroups, ui, router } = this.props.stores;
    const {
      toggleService,
      filter,
      resetFilter,
    } = this.props.actions.service;
    const isLoading = services.allServicesRequest.isExecuting;

    let allServices = services.all;
    if (services.filterNeedle !== null) {
      allServices = services.filtered;
    }

    // create Uncategorized service group in ServiceGroupsStore

    // const noServiceGroup = {
    //   name: 'Uncategorized',
    //   services: [],
    // };
    // const allServiceGroups = serviceGroups.all;
    // allServices.forEach((service) => {
    //   const serviceGroup = serviceGroups.one(service.groupId);
    //   if (!serviceGroup) {
    //     noServiceGroup.services.push(service);
    //     return;
    //   }
    //   serviceGroup.services.push(service);
    // });
    // allServiceGroups.unshift(noServiceGroup);

    // const groupServiceMapping = {};
    // allServices.forEach((service) => {
    //   if (groupServiceMapping[service.groupId] === undefined) {
    //     groupServiceMapping[service.groupId] = {
    //       group: serviceGroups.one(service.groupId),
    //       services: [],
    //     };
    //   }
    //   groupServiceMapping[service.groupId].services.push(service);
    // });
    // const groups = [];
    // for (group in groupServiceMapping) {
    //   groups.push(groupServiceMapping[group])
    // }

    return (
      <ServicesDashboard
        user={user.data}
        services={allServices}
        serviceGroups={ui.serviceGroupStructure}
        status={services.actionStatus}
        deleteService={() => this.deleteService()}
        toggleService={toggleService}
        isLoading={isLoading}
        filterServices={filter}
        resetFilter={resetFilter}
        goTo={router.push}
        servicesRequestFailed={services.allServicesRequest.wasExecuted && services.allServicesRequest.isError}
        retryServicesRequest={() => services.allServicesRequest.reload()}
        searchNeedle={services.filterNeedle}
        createServiceGroup={this.createServiceGroup}
        deleteServiceGroup={this.deleteServiceGroup}
        // reorder={this.props.actions.ui.reorderServiceStructure}
      />
    );
  }
}

ServicesScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    services: PropTypes.instanceOf(ServiceStore).isRequired,
    serviceGroups: PropTypes.instanceOf(ServiceGroupsStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.shape({
      showAddServiceInterface: PropTypes.func.isRequired,
      deleteService: PropTypes.func.isRequired,
      toggleService: PropTypes.func.isRequired,
      filter: PropTypes.func.isRequired,
      resetFilter: PropTypes.func.isRequired,
      resetStatus: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
