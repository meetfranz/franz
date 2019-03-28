import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import Pricing from '../../components/auth/Pricing';
import UserStore from '../../stores/UserStore';
import PaymentStore from '../../stores/PaymentStore';

import { globalError as globalErrorPropType } from '../../prop-types';

export default @inject('stores', 'actions') @observer class PricingScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  render() {
    const { actions, stores, error } = this.props;

    const nextStepRoute = stores.user.legacyServices.length ? stores.user.importRoute : stores.user.inviteRoute;

    return (
      <Pricing
        donor={stores.user.data.donor || {}}
        onSubmit={actions.user.signup}
        onCloseSubscriptionWindow={() => this.props.stores.router.push(nextStepRoute)}
        isLoading={stores.payment.plansRequest.isExecuting}
        isLoadingUser={stores.user.getUserInfoRequest.isExecuting}
        error={error}
        skipAction={() => this.props.stores.router.push(nextStepRoute)}
      />
    );
  }
}

PricingScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.shape({
      signup: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    payment: PropTypes.instanceOf(PaymentStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
};
