import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

// import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import UserStore from '../../stores/UserStore';
import ServiceStore from '../../stores/ServicesStore';
import { gaPage } from '../../lib/analytics';

import ServicesDashboard from '../../components/settings/services/ServicesDashboard';

@inject('stores', 'actions') @observer
export default class ServicesScreen extends Component {
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

  render() {
    const { user, services, router } = this.props.stores;
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

    return (
      <ServicesDashboard
        user={user.data}
        services={allServices}
        status={services.actionStatus}
        deleteService={() => this.deleteService()}
        toggleService={toggleService}
        isLoading={isLoading}
        filterServices={filter}
        resetFilter={resetFilter}
        goTo={router.push}
        servicesRequestFailed={services.allServicesRequest.wasExecuted && services.allServicesRequest.isError}
        retryServicesRequest={() => services.allServicesRequest.reload()}
      />
    );
  }
}

ServicesScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    services: PropTypes.instanceOf(ServiceStore).isRequired,
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
