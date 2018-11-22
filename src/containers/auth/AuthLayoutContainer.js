import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import AuthLayout from '../../components/auth/AuthLayout';
import AppStore from '../../stores/AppStore';
import GlobalErrorStore from '../../stores/GlobalErrorStore';

import { oneOrManyChildElements } from '../../prop-types';

export default @inject('stores', 'actions') @observer class AuthLayoutContainer extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { stores, actions, children, location } = this.props;

    return (
      <AuthLayout
        error={stores.globalError.response}
        pathname={location.pathname}
        isOnline={stores.app.isOnline}
        isAPIHealthy={!stores.app.healthCheckRequest.isError}
        retryHealthCheck={actions.app.healthCheck}
        isHealthCheckLoading={stores.app.healthCheckRequest.isExecuting}
        isFullScreen={stores.app.isFullScreen}
        darkMode={stores.app.isSystemDarkModeEnabled}
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
