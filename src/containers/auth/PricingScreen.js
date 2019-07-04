import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import Pricing from '../../components/auth/Pricing';
import UserStore from '../../stores/UserStore';

import { globalError as globalErrorPropType } from '../../prop-types';

export default @inject('stores', 'actions') @observer class PricingScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  async submit() {
    const {
      actions,
      stores,
    } = this.props;

    const { activateTrialRequest } = stores.user;
    const { defaultTrialPlan } = stores.features.features;

    actions.user.activateTrial({ planId: defaultTrialPlan });
    await activateTrialRequest._promise;

    if (!activateTrialRequest.isError) {
      stores.router.push('/');
      stores.user.hasCompletedSignup = true;
    }
  }

  render() {
    const {
      error,
      stores,
    } = this.props;

    const { getUserInfoRequest, activateTrialRequest } = stores.user;
    const { featuresRequest } = stores.features;

    return (
      <Pricing
        onSubmit={this.submit.bind(this)}
        isLoadingRequiredData={(getUserInfoRequest.isExecuting || !getUserInfoRequest.wasExecuted) || (featuresRequest.isExecuting || !featuresRequest.wasExecuted)}
        isActivatingTrial={activateTrialRequest.isExecuting}
        trialActivationError={activateTrialRequest.isError}
        error={error}
      />
    );
  }
}

PricingScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.shape({
      activateTrial: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
};
