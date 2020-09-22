/* eslint-disable no-await-in-loop */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { sleep } from '../../helpers/async-helpers';
import SetupAssistant from '../../components/auth/SetupAssistant';
import ServicesStore from '../../stores/ServicesStore';
import RecipesStore from '../../stores/RecipesStore';
import { TODOS_RECIPE_ID } from '../../features/todos';
import UserStore from '../../stores/UserStore';

export default @inject('stores', 'actions') @observer class SetupAssistantScreen extends Component {
  services = {
    whatsapp: {
      name: 'WhatsApp',
      hasTeamId: false,
    },
    messenger: {
      name: 'Messenger',
      hasTeamId: false,
    },
    gmail: {
      name: 'Gmail',
      hasTeamId: false,
    },
    skype: {
      name: 'Skype',
      hasTeamId: false,
    },
    telegram: {
      name: 'Telegram',
      hasTeamId: false,
    },
    instagram: {
      name: 'Instagram',
      hasTeamId: false,
    },
    slack: {
      name: 'Slack',
      hasTeamId: true,
    },
    hangouts: {
      name: 'Hangouts',
      hasTeamId: false,
    },
    linkedin: {
      name: 'LinkedIn',
      hasTeamId: false,
    },
  }

  state = {
    isSettingUpServices: false,
  }

  async setupServices(serviceConfig) {
    const { stores: { services, router, user } } = this.props;
    console.log(serviceConfig);

    this.setState({
      isSettingUpServices: true,
    });

    // The store requests are not build for paralell requests so we need to finish one request after another
    for (const config of serviceConfig) {
      const serviceData = {
        name: this.services[config.id].name,
      };

      if (config.team) {
        serviceData.team = config.team;
      }

      await services._createService({
        recipeId: config.id,
        serviceData,
        redirect: false,
        skipCleanup: true,
      });

      await sleep(100);
    }

    // Add Franz ToDos
    await services._createService({
      recipeId: TODOS_RECIPE_ID,
      serviceData: {
        name: 'Franz ToDos',
      },
      redirect: false,
      skipCleanup: true,
    });

    this.setState({
      isSettingUpServices: false,
    });

    await sleep(100);

    router.push(user.pricingRoute);
  }

  render() {
    return (
      <SetupAssistant
        onSubmit={config => this.setupServices(config)}
        services={this.services}
        embed={false}
        isSettingUpServices={this.state.isSettingUpServices}
      />
    );
  }
}

SetupAssistantScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore),
    recipes: PropTypes.instanceOf(RecipesStore),
    user: PropTypes.instanceOf(UserStore),
  }).isRequired,
  actions: PropTypes.shape({
    user: PropTypes.shape({
      invite: PropTypes.func.isRequired,
    }).isRequired,
    service: PropTypes.shape({
      createService: PropTypes.func.isRequired,
    }).isRequired,
    recipe: PropTypes.shape({
      install: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
