import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { H3, H2 } from '@meetfranz/ui';

import { Button } from '@meetfranz/forms';
import { FeatureList } from '../ui/FeatureList';
import { FeatureItem } from '../ui/FeatureItem';

const messages = defineMessages({
  submitButtonLabel: {
    id: 'subscription.cta.activateTrial',
    defaultMessage: '!!!Yes, start the free Franz Professional trial',
  },
  allOptionsButton: {
    id: 'subscription.cta.allOptions',
    defaultMessage: '!!!See all options',
  },
  teaserHeadline: {
    id: 'settings.account.headlineTrialUpgrade',
    defaultMessage: '!!!Get the free 14 day Franz Professional Trial',
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

const styles = theme => ({
  activateTrialButton: {
    margin: [40, 'auto', 10],
    display: 'flex',
  },
  allOptionsButton: {
    margin: [0, 0, 40],
    background: 'none',
    border: 'none',
    color: theme.colorText,
  },
  keyTerms: {
    marginTop: 20,
  },
});

export default @observer @injectSheet(styles) class TrialForm extends Component {
  static propTypes = {
    activateTrial: PropTypes.func.isRequired,
    isActivatingTrial: PropTypes.bool.isRequired,
    showAllOptions: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      isActivatingTrial,
      activateTrial,
      showAllOptions,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <>
        <H2>{intl.formatMessage(messages.teaserHeadline)}</H2>
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
        />
        <Button
          label={intl.formatMessage(messages.allOptionsButton)}
          className={classes.allOptionsButton}
          onClick={showAllOptions}
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
