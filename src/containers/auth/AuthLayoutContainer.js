import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import AuthLayout from '../../components/auth/AuthLayout';
import AppStore from '../../stores/AppStore';
import GlobalErrorStore from '../../stores/GlobalErrorStore';
import AppLoader from '../../components/ui/AppLoader';

import { oneOrManyChildElements } from '../../prop-types';

@inject('stores', 'actions') @observer
export default class AuthLayoutContainer extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { stores, actions, children, location } = this.props;
    const { features } = stores;

    const isLoadingBaseFeatures = features.baseFeaturesRequest.isExecuting
      && !features.baseFeaturesRequest.wasExecuted;

    if (isLoadingBaseFeatures) {
      return (
        <AppLoader />
      );
    }

    return (
      <AuthLayout
        error={stores.globalError.response}
        pathname={location.pathname}
        isOnline={stores.app.isOnline}
        isAPIHealthy={!stores.app.healthCheckRequest.isError}
        retryHealthCheck={actions.app.healthCheck}
        isHealthCheckLoading={stores.app.healthCheckRequest.isExecuting}
      >
        {children}
      </AuthLayout>
    );
  }
}

AuthLayoutContainer.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    globalError: PropTypes.instanceOf(GlobalErrorStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      healthCheck: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
