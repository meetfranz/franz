import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import PaymentStore from '../../stores/PaymentStore';
import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';
import FeaturesStore from '../../stores/FeaturesStore';

import AccountDashboard from '../../components/settings/account/AccountDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { WEBSITE } from '../../environment';

export default @inject('stores', 'actions') @observer class AccountScreen extends Component {
  onCloseWindow() {
    const { user, features } = this.props.stores;
    user.getUserInfoRequest.invalidate({ immediately: true });
    features.featuresRequest.invalidate({ immediately: true });
  }

  reloadData() {
    const { user, payment } = this.props.stores;

    user.getUserInfoRequest.reload();
    payment.plansRequest.reload();
  }

  handleWebsiteLink(route) {
    const { actions, stores } = this.props;

    const url = stores.user.getAuthURL(`${WEBSITE}${route}?utm_source=app&utm_medium=account_dashboard`);

    actions.app.openExternalUrl({ url });
  }

  render() {
    const { user, payment, features } = this.props.stores;
    const {
      user: userActions,
      payment: paymentActions,
    } = this.props.actions;

    const isLoadingUserInfo = user.getUserInfoRequest.isExecuting;
    const isLoadingPlans = payment.plansRequest.isExecuting;

    const { upgradeAccount } = paymentActions;

    return (
      <ErrorBoundary>
        <AccountDashboard
          user={user.data}
          isPremiumOverrideUser={user.isPremiumOverride}
          isProUser={user.isPro}
          isLoading={isLoadingUserInfo}
          isLoadingPlans={isLoadingPlans}
          userInfoRequestFailed={user.getUserInfoRequest.wasExecuted && user.getUserInfoRequest.isError}
          retryUserInfoRequest={() => this.reloadData()}
          onCloseSubscriptionWindow={() => this.onCloseWindow()}
          deleteAccount={userActions.delete}
          isLoadingDeleteAccount={user.deleteAccountRequest.isExecuting}
          isDeleteAccountSuccessful={user.deleteAccountRequest.wasExecuted && !user.deleteAccountRequest.isError}
          openEditAccount={() => this.handleWebsiteLink('/user/profile')}
          upgradeToPro={() => upgradeAccount({ planId: features.features.pricingConfig.plans.pro.yearly.id })}
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
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    payment: PropTypes.instanceOf(PaymentStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    payment: PropTypes.shape({
      createDashboardUrl: PropTypes.func.isRequired,
      upgradeAccount: PropTypes.func.isRequired,
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
