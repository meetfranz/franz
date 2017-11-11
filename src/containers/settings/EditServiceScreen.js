import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import UserStore from '../../stores/UserStore';
import RecipesStore from '../../stores/RecipesStore';
import ServicesStore from '../../stores/ServicesStore';
import Form from '../../lib/Form';
import { gaPage } from '../../lib/analytics';

import ServiceError from '../../components/settings/services/ServiceError';
import EditServiceForm from '../../components/settings/services/EditServiceForm';
import { required, url, oneRequired } from '../../helpers/validation-helpers';

const messages = defineMessages({
  name: {
    id: 'settings.service.form.name',
    defaultMessage: '!!!Name',
  },
  enableService: {
    id: 'settings.service.form.enableService',
    defaultMessage: '!!!Enable service',
  },
  enableNotification: {
    id: 'settings.service.form.enableNotification',
    defaultMessage: '!!!Enable Notifications',
  },
  enableAudio: {
    id: 'settings.service.form.enableAudio',
    defaultMessage: '!!!Enable audio',
  },
  team: {
    id: 'settings.service.form.team',
    defaultMessage: '!!!Team',
  },
  customUrl: {
    id: 'settings.service.form.customUrl',
    defaultMessage: '!!!Custom server',
  },
  indirectMessages: {
    id: 'settings.service.form.indirectMessages',
    defaultMessage: '!!!Show message badge for all new messages',
  },
});

@inject('stores', 'actions') @observer
export default class EditServiceScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    gaPage('Settings/Service/Edit');
  }

  onSubmit(data) {
    const { action } = this.props.router.params;
    const { recipes, services } = this.props.stores;
    const { createService, updateService } = this.props.actions.service;

    const serviceData = data;
    serviceData.isMuted = !serviceData.isMuted;

    if (action === 'edit') {
      updateService({ serviceId: services.activeSettings.id, serviceData });
    } else {
      createService({ recipeId: recipes.active.id, serviceData });
    }
  }

  prepareForm(recipe, service) {
    const { intl } = this.context;
    const config = {
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: service.id ? service.name : recipe.name,
        },
        isEnabled: {
          label: intl.formatMessage(messages.enableService),
          value: service.isEnabled,
          default: true,
        },
        isNotificationEnabled: {
          label: intl.formatMessage(messages.enableNotification),
          value: service.isNotificationEnabled,
          default: true,
        },
        isMuted: {
          label: intl.formatMessage(messages.enableAudio),
          value: !service.isMuted,
          default: true,
        },
      },
    };

    if (recipe.hasTeamId) {
      Object.assign(config.fields, {
        team: {
          label: intl.formatMessage(messages.team),
          placeholder: intl.formatMessage(messages.team),
          value: service.team,
          validate: [required],
        },
      });
    }

    if (recipe.hasCustomUrl) {
      Object.assign(config.fields, {
        customUrl: {
          label: intl.formatMessage(messages.customUrl),
          placeholder: 'https://',
          value: service.customUrl,
          validate: [required, url],
        },
      });
    }

    if (recipe.hasTeamId && recipe.hasCustomUrl) {
      config.fields.team.validate = [oneRequired(['team', 'customUrl'])];
      config.fields.customUrl.validate = [url, oneRequired(['team', 'customUrl'])];
    }

    if (recipe.hasIndirectMessages) {
      Object.assign(config.fields, {
        isIndirectMessageBadgeEnabled: {
          label: intl.formatMessage(messages.indirectMessages),
          value: service.isIndirectMessageBadgeEnabled,
          default: true,
        },
      });
    }

    return new Form(config);
  }

  deleteService() {
    const { deleteService } = this.props.actions.service;
    const { action } = this.props.router.params;

    if (action === 'edit') {
      const { activeSettings: service } = this.props.stores.services;
      deleteService({
        serviceId: service.id,
        redirect: '/settings/services',
      });
    }
  }

  render() {
    const { recipes, services, user } = this.props.stores;
    const { action } = this.props.router.params;

    let recipe;
    let service = {};
    let isLoading = false;

    if (action === 'add') {
      recipe = recipes.active;

      // TODO: render error message when recipe is `null`
      if (!recipe) {
        return (
          <ServiceError />
        );
      }
    } else {
      service = services.activeSettings;
      isLoading = services.allServicesRequest.isExecuting;

      if (!isLoading && service) {
        recipe = service.recipe;
      }
    }

    if (isLoading) {
      return (<div>Loading...</div>);
    }

    const form = this.prepareForm(recipe, service);

    return (
      <EditServiceForm
        action={action}
        recipe={recipe}
        service={service}
        user={user.data}
        form={form}
        status={services.actionStatus}
        isSaving={services.updateServiceRequest.isExecuting || services.createServiceRequest.isExecuting}
        isDeleting={services.deleteServiceRequest.isExecuting}
        onSubmit={d => this.onSubmit(d)}
        onDelete={() => this.deleteService()}
      />
    );
  }
}

EditServiceScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    recipes: PropTypes.instanceOf(RecipesStore).isRequired,
    services: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
  router: PropTypes.shape({
    params: PropTypes.shape({
      action: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.shape({
      createService: PropTypes.func.isRequired,
      updateService: PropTypes.func.isRequired,
      deleteService: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
