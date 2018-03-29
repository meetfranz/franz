import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import { defineMessages, intlShape } from 'react-intl';

// import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import UserStore from '../../stores/UserStore';
import ServiceStore from '../../stores/ServicesStore';
import ServiceGroupsStore from '../../stores/ServiceGroupsStore';
import UIStore from '../../stores/UIStore';
import Form from '../../lib/Form';
import { gaPage } from '../../lib/analytics';

import ServicesDashboard from '../../components/settings/services/ServicesDashboard';

const messages = defineMessages({
  groupName: {
    id: 'settings.services.newGroup',
    defaultMessage: '!!!New Group',
  },
});

@inject('stores', 'actions') @observer
export default class ServicesScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();
    this.createServiceGroup = this.createServiceGroup.bind(this);
    this.updateServiceGroup = this.updateServiceGroup.bind(this);
    this.deleteServiceGroup = this.deleteServiceGroup.bind(this);
  }

  componentDidMount() {
    gaPage('Settings/Service Dashboard');
  }

  componentWillUnmount() {
    this.props.actions.service.resetFilter();
    this.props.actions.service.resetStatus();
  }

  prepareForm() {
    const { intl } = this.context;

    return new Form({
      fields: {
        groupName: {
          placeholder: intl.formatMessage(messages.groupName),
        },
      },
    });
  }

  deleteService() {
    this.props.actions.service.deleteService();
    this.props.stores.services.resetFilter();
  }

  createServiceGroup(name) {
    this.props.actions.serviceGroup.createServiceGroup({
      serviceGroupData: {
        name,
        order: this.props.stores.ui.nextServiceGroupOrder,
      },
    });
  }

  updateServiceGroup(serviceGroupId, name) {
    this.props.actions.serviceGroup.updateServiceGroup({
      serviceGroupId,
      serviceGroupData: {
        name,
      },
    });
  }

  deleteServiceGroup(serviceGroupId) {
    const collapsedGroups = this.props.stores.settings.all.group.collapsed;
    if (collapsedGroups.includes(serviceGroupId)) {
      this.props.actions.settings.update({
        type: 'group',
        data: {
          collapsed: collapsedGroups.filter(id => id !== serviceGroupId),
        },
      });
    }
    this.props.actions.serviceGroup.deleteServiceGroup({
      serviceGroupId,
    });
  }

  render() {
    const { user, services, ui, router } = this.props.stores;
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

    const newGroupForm = this.prepareForm();

    return (
      <ServicesDashboard
        user={user.data}
        services={allServices}
        serviceGroups={ui.serviceGroupStructure}
        reorder={this.props.actions.ui.reorderServiceStructure}
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
        updateServiceGroup={this.updateServiceGroup}
        deleteServiceGroup={this.deleteServiceGroup}
        newGroupForm={newGroupForm}
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
    ui: PropTypes.instanceOf(UIStore).isRequired,
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
    serviceGroup: PropTypes.shape({
      createServiceGroup: PropTypes.func.isRequired,
      updateServiceGroup: PropTypes.func.isRequired,
      deleteServiceGroup: PropTypes.func.isRequired,
    }),
    ui: PropTypes.shape({
      reorderServiceStructure: PropTypes.func.isRequired,
    }),
  }).isRequired,
};
