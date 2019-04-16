import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { ProBadge } from '@meetfranz/ui';

import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';
import SubscriptionForm from '../../../containers/subscription/SubscriptionFormScreen';

const messages = defineMessages({
  headline: {
    id: 'settings.account.headline',
    defaultMessage: '!!!Account',
  },
  headlineSubscription: {
    id: 'settings.account.headlineSubscription',
    defaultMessage: '!!!Your Subscription',
  },
  headlineUpgrade: {
    id: 'settings.account.headlineUpgrade',
    defaultMessage: '!!!Upgrade your Account',
  },
  headlineDangerZone: {
    id: 'settings.account.headlineDangerZone',
    defaultMessage: '!!Danger Zone',
  },
  manageSubscriptionButtonLabel: {
    id: 'settings.account.manageSubscription.label',
    defaultMessage: '!!!Manage your subscription',
  },
  accountTypeBasic: {
    id: 'settings.account.accountType.basic',
    defaultMessage: '!!!Basic Account',
  },
  accountTypePremium: {
    id: 'settings.account.accountType.premium',
    defaultMessage: '!!!Premium Supporter Account',
  },
  accountEditButton: {
    id: 'settings.account.account.editButton',
    defaultMessage: '!!!Edit Account',
  },
  invoicesButton: {
    id: 'settings.account.headlineInvoices',
    defaultMessage: '!!Invoices',
  },
  invoiceDownload: {
    id: 'settings.account.invoiceDownload',
    defaultMessage: '!!!Download',
  },
  userInfoRequestFailed: {
    id: 'settings.account.userInfoRequestFailed',
    defaultMessage: '!!!Could not load user information',
  },
  tryReloadUserInfoRequest: {
    id: 'settings.account.tryReloadUserInfoRequest',
    defaultMessage: '!!!Try again',
  },
  deleteAccount: {
    id: 'settings.account.deleteAccount',
    defaultMessage: '!!!Delete account',
  },
  deleteInfo: {
    id: 'settings.account.deleteInfo',
    defaultMessage: '!!!If you don\'t need your Franz account any longer, you can delete your account and all related data here.',
  },
  deleteEmailSent: {
    id: 'settings.account.deleteEmailSent',
    defaultMessage: '!!!You have received an email with a link to confirm your account deletion. Your account and data cannot be restored!',
  },
});

export default @observer class AccountDashboard extends Component {
  static propTypes = {
    user: MobxPropTypes.observableObject.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingPlans: PropTypes.bool.isRequired,
    userInfoRequestFailed: PropTypes.bool.isRequired,
    retryUserInfoRequest: PropTypes.func.isRequired,
    onCloseSubscriptionWindow: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    isLoadingDeleteAccount: PropTypes.bool.isRequired,
    isDeleteAccountSuccessful: PropTypes.bool.isRequired,
    openEditAccount: PropTypes.func.isRequired,
    openBilling: PropTypes.func.isRequired,
    openInvoices: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      user,
      isLoading,
      isLoadingPlans,
      userInfoRequestFailed,
      retryUserInfoRequest,
      onCloseSubscriptionWindow,
      deleteAccount,
      isLoadingDeleteAccount,
      isDeleteAccountSuccessful,
      openEditAccount,
      openBilling,
      openInvoices,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          {isLoading && (
            <Loader />
          )}

          {!isLoading && userInfoRequestFailed && (
            <Infobox
              icon="alert"
              type="danger"
              ctaLabel={intl.formatMessage(messages.tryReloadUserInfoRequest)}
              ctaLoading={isLoading}
              ctaOnClick={retryUserInfoRequest}
            >
              {intl.formatMessage(messages.userInfoRequestFailed)}
            </Infobox>
          )}

          {!userInfoRequestFailed && (
            <Fragment>
              {!isLoading && (
                <div className="account">
                  <div className="account__box account__box--flex">
                    <div className="account__avatar">
                      <img
                        src="./assets/images/logo.svg"
                        alt=""
                      />
                    </div>
                    <div className="account__info">
                      <h2>
                        <span className="username">{`${user.firstname} ${user.lastname}`}</span>
                        {user.isPremium && (
                          <>
                            {' '}
                            <ProBadge />
                            <span className="badge badge--premium">{intl.formatMessage(messages.accountTypePremium)}</span>
                          </>
                        )}
                      </h2>
                      {user.organization && `${user.organization}, `}
                      {user.email}
                      {user.isPremium && (
                        <div className="manage-user-links">
                          <Button
                            label={intl.formatMessage(messages.accountEditButton)}
                            className="franz-form__button--inverted"
                            onClick={openEditAccount}
                          />
                          {user.isSubscriptionOwner && (
                            <>
                              <Button
                                label={intl.formatMessage(messages.manageSubscriptionButtonLabel)}
                                className="franz-form__button--inverted"
                                onClick={openBilling}
                              />
                              <Button
                                label={intl.formatMessage(messages.invoicesButton)}
                                className="franz-form__button--inverted"
                                onClick={openInvoices}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {!user.isPremium && (
                      <Button
                        label={intl.formatMessage(messages.accountEditButton)}
                        className="franz-form__button--inverted"
                        onClick={openEditAccount}
                      />
                    )}
                  </div>
                </div>
              )}

              {!user.isPremium && (
                isLoadingPlans ? (
                  <Loader />
                ) : (
                  <div className="account franz-form">
                    <div className="account__box">
                      <h2>{intl.formatMessage(messages.headlineUpgrade)}</h2>
                      <SubscriptionForm
                        onCloseWindow={onCloseSubscriptionWindow}
                      />
                    </div>
                  </div>
                )
              )}

              <div className="account franz-form">
                <div className="account__box">
                  <h2>{intl.formatMessage(messages.headlineDangerZone)}</h2>
                  {!isDeleteAccountSuccessful && (
                  <div className="account__subscription">
                    <p>{intl.formatMessage(messages.deleteInfo)}</p>
                    <Button
                      label={intl.formatMessage(messages.deleteAccount)}
                      buttonType="danger"
                      onClick={() => deleteAccount()}
                      loaded={!isLoadingDeleteAccount}
                    />
                  </div>
                  )}
                  {isDeleteAccountSuccessful && (
                  <p>{intl.formatMessage(messages.deleteEmailSent)}</p>
                  )}
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}
