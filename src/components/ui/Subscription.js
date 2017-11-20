import React, { Component } from 'react';
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
  typeMining: {
    id: 'subscription.type.mining',
    defaultMessage: '!!!Support Franz with processing power',
  },
  includedFeatures: {
    id: 'subscription.includedFeatures',
    defaultMessage: '!!!The Franz Premium Supporter Account includes',
  },
  features: {
    unlimitedServices: {
      id: 'subscription.features.unlimitedServices',
      defaultMessage: '!!!Add unlimited services',
    },
    onpremise: {
      id: 'subscription.features.onpremise',
      defaultMessage: '!!!Add on-premise/hosted services like HipChat',
    },
    customServices: {
      id: 'subscription.features.customServices',
      defaultMessage: '!!!Add your custom services',
    },
    encryptedSync: {
      id: 'subscription.features.encryptedSync',
      defaultMessage: '!!!Encrypted session synchronization',
    },
    vpn: {
      id: 'subscription.features.vpn',
      defaultMessage: '!!!Proxy & VPN support',
    },
    ads: {
      id: 'subscription.features.ads',
      defaultMessage: '!!!No ads, ever!',
    },
    comingSoon: {
      id: 'subscription.features.comingSoon',
      defaultMessage: '!!!coming soon',
    },
  },
  miningHeadline: {
    id: 'subscription.mining.headline',
    defaultMessage: '!!!How does this work?',
  },
  experimental: {
    id: 'subscription.mining.experimental',
    defaultMessage: '!!!experimental',
  },
  miningDetail1: {
    id: 'subscription.mining.line1',
    defaultMessage: '!!!By enabling "Support with processing power", Franz will use about 20-50% of your CPU to mine cryptocurrency Monero which equals approximately € 5/year.',
  },
  miningDetail2: {
    id: 'subscription.mining.line2',
    defaultMessage: '!!!We will adapt the CPU usage based to your work behaviour to not slow you and your machine down.',
  },
  miningDetail3: {
    id: 'subscription.mining.line3',
    defaultMessage: '!!!As long as the miner is active, you will have unlimited access to all the Franz Premium Supporter Features.',
  },
  miningMoreInfo: {
    id: 'subscription.mining.moreInformation',
    defaultMessage: '!!!Get more information about this plan',
  },
  euTaxInfo: {
    id: 'subscription.euTaxInfo',
    defaultMessage: '!!!EU residents: local sales tax may apply',
  },
});

@observer
export default class SubscriptionForm extends Component {
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
    openExternalUrl: PropTypes.func.isRequired,
  };

  static defaultProps ={
    content: '',
    showSkipOption: false,
    skipAction: () => null,
    skipButtonLabel: '',
  }

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
          validate: [required],
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

    if (this.props.plan.miner) {
      form.fields.paymentTier.options.push({
        value: 'mining',
        label: intl.formatMessage(messages.typeMining),
      });
    }

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
      openExternalUrl,
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
            {this.form.$('paymentTier').value !== 'mining' && (
              <div>
                <p>
                  <strong>{intl.formatMessage(messages.includedFeatures)}</strong>
                </p>
                <div className="subscription">
                  <ul className="subscription__premium-features">
                    <li>{intl.formatMessage(messages.features.onpremise)}</li>
                    <li>
                      {intl.formatMessage(messages.features.encryptedSync)}
                      <span className="badge">{intl.formatMessage(messages.features.comingSoon)}</span>
                    </li>
                    <li>
                      {intl.formatMessage(messages.features.customServices)}
                      <span className="badge">{intl.formatMessage(messages.features.comingSoon)}</span>
                    </li>
                    <li>
                      {intl.formatMessage(messages.features.vpn)}
                      <span className="badge">{intl.formatMessage(messages.features.comingSoon)}</span>
                    </li>
                    <li>
                      {intl.formatMessage(messages.features.ads)}
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {this.form.$('paymentTier').value === 'mining' && (
              <div className="subscription mining-details">
                <p>
                  <strong>{intl.formatMessage(messages.miningHeadline)}</strong>
                  &nbsp;
                  <span className="badge">{intl.formatMessage(messages.experimental)}</span>
                </p>
                <p>{intl.formatMessage(messages.miningDetail1)}</p>
                <p>{intl.formatMessage(messages.miningDetail2)}</p>
                <p>{intl.formatMessage(messages.miningDetail3)}</p>
                <p>
                  <button
                    onClick={() => openExternalUrl({ url: 'http://meetfranz.com/mining' })}
                  >
                    {intl.formatMessage(messages.miningMoreInfo)}
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
        <div>
          {error.code === 'no-payment-session' && (
            <p className="error-message center">{intl.formatMessage(messages.paymentSessionError)}</p>
          )}
        </div>
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
        {this.form.$('paymentTier').value !== 'skip' && this.form.$('paymentTier').value !== 'mining' && (
          <p className="legal">
            {intl.formatMessage(messages.euTaxInfo)}
          </p>
        )}
      </Loader>
    );
  }
}
