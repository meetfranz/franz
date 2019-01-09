import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import PaymentStore from '../../stores/PaymentStore';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';
import { gaPage } from '../../lib/analytics';

import AccountDashboard from '../../components/settings/account/AccountDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';

const { BrowserWindow } = remote;

export default @inject('stores', 'actions') @observer class AccountScreen extends Component {
  componentWillMount() {
    const {
      user,
    } = this.props.stores;

    user.getUserInfoRequest.invalidate({ immediately: true });
  }

  componentDidMount() {
    gaPage('Settings/Account Dashboard');
  }

  onCloseWindow() {
    const { user, payment } = this.props.stores;
    user.getUserInfoRequest.invalidate({ immediately: true });
    payment.ordersDataRequest.invalidate({ immediately: true });
  }

  reloadData() {
    const { user, payment } = this.props.stores;

    user.getUserInfoRequest.reload();
    payment.ordersDataRequest.reload();
    payment.plansRequest.reload();
  }

  async handlePaymentDashboard() {
    const { actions, stores } = this.props;

    actions.payment.createDashboardUrl();

    const dashboard = await stores.payment.createDashboardUrlRequest;

    if (dashboard.url) {
      const paymentWindow = new BrowserWindow({
        title: '🔒 Franz Subscription Dashboard',
        parent: remote.getCurrentWindow(),
        modal: false,
        width: 900,
        minWidth: 600,
        webPreferences: {
          nodeIntegration: false,
        },
      });
      paymentWindow.loadURL(dashboard.url);

      paymentWindow.on('closed', () => {
        this.onCloseWindow();
      });
    }
  }

  render() {
    const { user, payment } = this.props.stores;
    const { openExternalUrl } = this.props.actions.app;
    const { user: userActions } = this.props.actions;

    const isLoadingUserInfo = user.getUserInfoRequest.isExecuting;
    const isLoadingOrdersInfo = payment.ordersDataRequest.isExecuting;
    const isLoadingPlans = payment.plansRequest.isExecuting;

    return (
      <ErrorBoundary>
        <AccountDashboard
          user={user.data}
          orders={payment.orders}
          isLoading={isLoadingUserInfo}
          isLoadingOrdersInfo={isLoadingOrdersInfo}
          isLoadingPlans={isLoadingPlans}
          userInfoRequestFailed={user.getUserInfoRequest.wasExecuted && user.getUserInfoRequest.isError}
          retryUserInfoRequest={() => this.reloadData()}
          isCreatingPaymentDashboardUrl={payment.createDashboardUrlRequest.isExecuting}
          openDashboard={price => this.handlePaymentDashboard(price)}
          openExternalUrl={url => openExternalUrl({ url })}
          onCloseSubscriptionWindow={() => this.onCloseWindow()}
          deleteAccount={userActions.delete}
          isLoadingDeleteAccount={user.deleteAccountRequest.isExecuting}
          isDeleteAccountSuccessful={user.deleteAccountRequest.wasExecuted && !user.deleteAccountRequest.isError}
        />
      </ErrorBoundary>
    );
  }
}

AccountScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    payment: PropTypes.instanceOf(PaymentStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    payment: PropTypes.shape({
      createDashboardUrl: PropTypes.func.isRequired,
    }).isRequired,
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
