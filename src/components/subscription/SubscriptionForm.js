import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import Radio from '../ui/Radio';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

import { required } from '../../helpers/validation-helpers';

const messages = defineMessages({
  submitButtonLabel: {
    id: 'subscription.submit.label',
    defaultMessage: '!!!Support the development of Franz',
  },
  paymentSessionError: {
    id: 'subscription.paymentSessionError',
    defaultMessage: '!!!Could not initialize payment form',
  },
  typeFree: {
    id: 'subscription.type.free',
    defaultMessage: '!!!free',
  },
  typeMonthly: {
    id: 'subscription.type.month',
    defaultMessage: '!!!month',
  },
  typeYearly: {
    id: 'subscription.type.year',
    defaultMessage: '!!!year',
  },
  includedFeatures: {
    id: 'subscription.includedFeatures',
    defaultMessage: '!!!The Franz Premium Supporter Account includes',
  },
  onpremise: {
    id: 'subscription.features.onpremise.mattermost',
    defaultMessage: '!!!Add on-premise/hosted services like Mattermost',
  },
  noInterruptions: {
    id: 'subscription.features.noInterruptions',
    defaultMessage: '!!!No app delays & nagging to upgrade license',
  },
  proxy: {
    id: 'subscription.features.proxy',
    defaultMessage: '!!!Proxy support for services',
  },
  spellchecker: {
    id: 'subscription.features.spellchecker',
    defaultMessage: '!!!Support for Spellchecker',
  },
  workspaces: {
    id: 'subscription.features.workspaces',
    defaultMessage: '!!!Organize your services in workspaces',
  },
  ads: {
    id: 'subscription.features.ads',
    defaultMessage: '!!!No ads, ever!',
  },
  comingSoon: {
    id: 'subscription.features.comingSoon',
    defaultMessage: '!!!coming soon',
  },
  euTaxInfo: {
    id: 'subscription.euTaxInfo',
    defaultMessage: '!!!EU residents: local sales tax may apply',
  },
});

export default @observer class SubscriptionForm extends Component {
  static propTypes = {
    plan: MobxPropTypes.objectOrObservableObject.isRequired,
    isLoading: PropTypes.bool.isRequired,
    handlePayment: PropTypes.func.isRequired,
    retryPlanRequest: PropTypes.func.isRequired,
    isCreatingHostedPage: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    showSkipOption: PropTypes.bool,
    skipAction: PropTypes.func,
    skipButtonLabel: PropTypes.string,
    hideInfo: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    showSkipOption: false,
    skipAction: () => null,
    skipButtonLabel: '',
  };

  static contextTypes = {
    intl: intlShape,
  };

  componentWillMount() {
    this.form = this.prepareForm();
  }

  prepareForm() {
    const { intl } = this.context;

    const form = {
      fields: {
        paymentTier: {
          value: 'year',
          validators: [required],
          options: [{
            value: 'month',
            label: `€ ${Object.hasOwnProperty.call(this.props.plan, 'month')
              ? `${this.props.plan.month.price} / ${intl.formatMessage(messages.typeMonthly)}`
              : 'monthly'}`,
          }, {
            value: 'year',
            label: `€ ${Object.hasOwnProperty.call(this.props.plan, 'year')
              ? `${this.props.plan.year.price} / ${intl.formatMessage(messages.typeYearly)}`
              : 'yearly'}`,
          }],
        },
      },
    };

    if (this.props.showSkipOption) {
      form.fields.paymentTier.options.unshift({
        value: 'skip',
        label: `€ 0 / ${intl.formatMessage(messages.typeFree)}`,
      });
    }

    return new Form(form, this.context.intl);
  }

  render() {
    const {
      isLoading,
      isCreatingHostedPage,
      handlePayment,
      retryPlanRequest,
      error,
      showSkipOption,
      skipAction,
      skipButtonLabel,
      hideInfo,
    } = this.props;
    const { intl } = this.context;

    if (error) {
      return (
        <Button
          label="Reload"
          onClick={retryPlanRequest}
          isLoaded={!isLoading}
        />
      );
    }

    return (
      <Loader loaded={!isLoading}>
        <Radio field={this.form.$('paymentTier')} showLabel={false} className="paymentTiers" />
        {!hideInfo && (
          <div className="subscription__premium-info">
            <p>
              <strong>{intl.formatMessage(messages.includedFeatures)}</strong>
            </p>
            <div className="subscription">
              <ul className="subscription__premium-features">
                <li>{intl.formatMessage(messages.onpremise)}</li>
                <li>
                  {intl.formatMessage(messages.noInterruptions)}
                </li>
                <li>
                  {intl.formatMessage(messages.spellchecker)}
                </li>
                <li>
                  {intl.formatMessage(messages.proxy)}
                </li>
                <li>
                  {intl.formatMessage(messages.workspaces)}
                </li>
                <li>
                  {intl.formatMessage(messages.ads)}
                </li>
              </ul>
            </div>
          </div>
        )}
        <Fragment>
          {error.code === 'no-payment-session' && (
            <p className="error-message center">{intl.formatMessage(messages.paymentSessionError)}</p>
          )}
        </Fragment>
        {showSkipOption && this.form.$('paymentTier').value === 'skip' ? (
          <Button
            label={skipButtonLabel}
            className="auth__button"
            onClick={skipAction}
          />
        ) : (
          <Button
            label={intl.formatMessage(messages.submitButtonLabel)}
            className="auth__button"
            loaded={!isCreatingHostedPage}
            onClick={() => handlePayment(this.form.$('paymentTier').value)}
          />
        )}
        {this.form.$('paymentTier').value !== 'skip' && (
          <p className="legal">
            {intl.formatMessage(messages.euTaxInfo)}
          </p>
        )}
      </Loader>
    );
  }
}
