import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { H3 } from '@meetfranz/ui';

import { Button } from '@meetfranz/forms';
import { FeatureList } from '../ui/FeatureList';
import { FeatureItem } from '../ui/FeatureItem';

const messages = defineMessages({
  submitButtonLabel: {
    id: 'subscription.cta.activateTrial',
    defaultMessage: '!!!Yes, upgrade my account to Franz Professional',
  },
  includedFeatures: {
    id: 'subscription.includedProFeatures',
    defaultMessage: '!!!The Franz Professional Plan includes:',
  },
  noStringsAttachedHeadline: {
    id: 'pricing.trial.terms.headline',
    defaultMessage: '!!!No strings attached',
  },
  noCreditCard: {
    id: 'pricing.trial.terms.noCreditCard',
    defaultMessage: '!!!No credit card required',
  },
  automaticTrialEnd: {
    id: 'pricing.trial.terms.automaticTrialEnd',
    defaultMessage: '!!!Your free trial ends automatically after 14 days',
  },
});

const styles = () => ({
  activateTrialButton: {
    margin: [40, 0, 50],
  },
  keyTerms: {
    marginTop: 20,
  },
});

export default @observer @injectSheet(styles) class SubscriptionForm extends Component {
  static propTypes = {
    activateTrial: PropTypes.func.isRequired,
    isActivatingTrial: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      isActivatingTrial,
      activateTrial,
      classes,
    } = this.props;
    const { intl } = this.context;

    console.log('isActivatingTrial', isActivatingTrial);

    return (
      <>
        <H3 className={classes.keyTerms}>
          {intl.formatMessage(messages.noStringsAttachedHeadline)}
        </H3>
        <ul>
          <FeatureItem icon="👉" name={intl.formatMessage(messages.noCreditCard)} />
          <FeatureItem icon="👉" name={intl.formatMessage(messages.automaticTrialEnd)} />
        </ul>

        <Button
          label={intl.formatMessage(messages.submitButtonLabel)}
          className={classes.activateTrialButton}
          busy={isActivatingTrial}
          onClick={activateTrial}
          stretch
        />
        <div className="subscription__premium-info">
          <H3>
            {intl.formatMessage(messages.includedFeatures)}
          </H3>
          <div className="subscription">
            <FeatureList />
          </div>
        </div>
      </>
    );
  }
}
