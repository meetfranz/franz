import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import PaymentStore from '../../stores/PaymentStore';

import SubscriptionForm from '../../components/subscription/SubscriptionForm';

const { BrowserWindow } = remote;

export default @inject('stores', 'actions') @observer class SubscriptionFormScreen extends Component {
  static propTypes = {
    onCloseWindow: PropTypes.func,
    content: PropTypes.node,
    showSkipOption: PropTypes.bool,
    skipAction: PropTypes.func,
    skipButtonLabel: PropTypes.string,
    hideInfo: PropTypes.bool,
  }

  static defaultProps = {
    onCloseWindow: () => null,
    content: '',
    showSkipOption: false,
    skipAction: () => null,
    skipButtonLabel: '',
    hideInfo: false,
  }

  async handlePayment(plan) {
    const {
      actions,
      stores,
      onCloseWindow,
    } = this.props;

    const interval = plan;

    const { id } = stores.payment.plan[interval];
    actions.payment.createHostedPage({
      planId: id,
    });

    const hostedPage = await stores.payment.createHostedPageRequest;

    if (hostedPage.url) {
      if (hostedPage.legacyCheckoutFlow) {
        const paymentWindow = new BrowserWindow({
          parent: remote.getCurrentWindow(),
          modal: true,
          title: '🔒 Franz Supporter License',
          width: 600,
          height: window.innerHeight - 100,
          maxWidth: 600,
          minWidth: 600,
          webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
          },
        });
        paymentWindow.loadURL(`file://${__dirname}/../../index.html#/payment/${encodeURIComponent(hostedPage.url)}`);

        paymentWindow.on('closed', () => {
          onCloseWindow();
        });
      } else {
        actions.app.openExternalUrl({
          url: hostedPage.url,
        });
      }
    }
  }

  render() {
    const {
      content,
      actions,
      stores,
      showSkipOption,
      skipAction,
      skipButtonLabel,
      hideInfo,
    } = this.props;
    return (
      <SubscriptionForm
        plan={stores.payment.plan}
        isLoading={stores.payment.plansRequest.isExecuting}
        retryPlanRequest={() => stores.payment.plansRequest.reload()}
        isCreatingHostedPage={stores.payment.createHostedPageRequest.isExecuting}
        handlePayment={price => this.handlePayment(price)}
        content={content}
        error={stores.payment.plansRequest.isError}
        showSkipOption={showSkipOption}
        skipAction={skipAction}
        skipButtonLabel={skipButtonLabel}
        hideInfo={hideInfo}
        openExternalUrl={actions.app.openExternalUrl}
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
