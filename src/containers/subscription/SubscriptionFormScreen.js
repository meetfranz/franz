import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { ipcRenderer } from 'electron';
import PaymentStore from '../../stores/PaymentStore';

import SubscriptionForm from '../../components/subscription/SubscriptionForm';
import TrialForm from '../../components/subscription/TrialForm';

export default @inject('stores', 'actions') @observer class SubscriptionFormScreen extends Component {
  static propTypes = {
    onCloseWindow: PropTypes.func,
  }

  static defaultProps = {
    onCloseWindow: () => null,
  }

  async openBrowser() {
    const {
      stores,
      onCloseWindow,
    } = this.props;

    const {
      user,
      features,
    } = stores;

    let hostedPageURL = features.features.planSelectionURL;
    hostedPageURL = user.getAuthURL(hostedPageURL);

    await ipcRenderer.invoke('open-inline-subscription-window', { url: hostedPageURL });

    // once the promise is resolved, we trigger the callback
    onCloseWindow();
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
