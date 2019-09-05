import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import PaymentStore from '../../stores/PaymentStore';

import SubscriptionForm from '../../components/subscription/SubscriptionForm';
import TrialForm from '../../components/subscription/TrialForm';

export default @inject('stores', 'actions') @observer class SubscriptionFormScreen extends Component {
  async openBrowser() {
    const {
      actions,
      stores,
    } = this.props;

    const {
      user,
      features,
    } = stores;

    let hostedPageURL = features.features.planSelectionURL;
    hostedPageURL = user.getAuthURL(hostedPageURL);

    actions.app.openExternalUrl({ url: hostedPageURL });
  }

  render() {
    const {
      actions,
      stores,
    } = this.props;

    const { data: user } = stores.user;

    if (user.hadSubscription) {
      return (
        <SubscriptionForm
          plan={stores.payment.plan}
          selectPlan={() => this.openBrowser()}
          isActivatingTrial={stores.user.activateTrialRequest.isExecuting || stores.user.getUserInfoRequest.isExecuting}
        />
      );
    }

    return (
      <TrialForm
        plan={stores.payment.plan}
        activateTrial={() => actions.user.activateTrial({ planId: stores.features.features.defaultTrialPlan })}
        showAllOptions={() => this.openBrowser()}
        isActivatingTrial={stores.user.activateTrialRequest.isExecuting || stores.user.getUserInfoRequest.isExecuting}
      />
    );
  }
}

SubscriptionFormScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    payment: PropTypes.shape({
      createHostedPage: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    payment: PropTypes.instanceOf(PaymentStore).isRequired,
  }).isRequired,
};
