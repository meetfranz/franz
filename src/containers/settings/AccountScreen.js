import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import PaymentStore from '../../stores/PaymentStore';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';

import AccountDashboard from '../../components/settings/account/AccountDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { WEBSITE } from '../../environment';

export default @inject('stores', 'actions') @observer class AccountScreen extends Component {
  onCloseWindow() {
    const { user } = this.props.stores;
    user.getUserInfoRequest.invalidate({ immediately: true });
  }

  reloadData() {
    const { user, payment } = this.props.stores;

    user.getUserInfoRequest.reload();
    payment.plansRequest.reload();
  }

  handleWebsiteLink(route) {
    const { actions, stores } = this.props;

    const url = `${WEBSITE}${route}?authToken=${stores.user.authToken}&utm_source=app&utm_medium=account_dashboard`;

    actions.app.openExternalUrl({ url });
  }

  render() {
    const { user, payment } = this.props.stores;
    const { user: userActions } = this.props.actions;

    const isLoadingUserInfo = user.getUserInfoRequest.isExecuting;
    const isLoadingPlans = payment.plansRequest.isExecuting;

    return (
      <ErrorBoundary>
        <AccountDashboard
          user={user.data}
          isLoading={isLoadingUserInfo}
          isLoadingPlans={isLoadingPlans}
          userInfoRequestFailed={user.getUserInfoRequest.wasExecuted && user.getUserInfoRequest.isError}
          retryUserInfoRequest={() => this.reloadData()}
          onCloseSubscriptionWindow={() => this.onCloseWindow()}
          deleteAccount={userActions.delete}
          isLoadingDeleteAccount={user.deleteAccountRequest.isExecuting}
          isDeleteAccountSuccessful={user.deleteAccountRequest.wasExecuted && !user.deleteAccountRequest.isError}
          openEditAccount={() => this.handleWebsiteLink('/user/profile')}
          openBilling={() => this.handleWebsiteLink('/user/billing')}
          openInvoices={() => this.handleWebsiteLink('/user/invoices')}
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
