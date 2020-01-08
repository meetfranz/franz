import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { H3, H2 } from '@meetfranz/ui';

import { Button } from '@meetfranz/forms';
import { FeatureList } from '../ui/FeatureList';

const messages = defineMessages({
  submitButtonLabel: {
    id: 'subscription.cta.choosePlan',
    defaultMessage: '!!!Choose your plan',
  },
  teaserHeadline: {
    id: 'settings.account.headlineUpgradeAccount',
    defaultMessage: '!!!Upgrade your account and get the full Franz experience',
  },
  teaserText: {
    id: 'subscription.teaser.intro',
    defaultMessage: '!!!Franz 5 comes with a wide range of new features to boost up your everyday communication - batteries included. Check out our new plans and find out which one suits you most!',
  },
  includedFeatures: {
    id: 'subscription.teaser.includedFeatures',
    defaultMessage: '!!!Paid Franz Plans include:',
  },
});

const styles = () => ({
  activateTrialButton: {
    margin: [40, 'auto', 50],
    display: 'flex',
  },
});

export default @observer @injectSheet(styles) class SubscriptionForm extends Component {
  static propTypes = {
    selectPlan: PropTypes.func.isRequired,
    isActivatingTrial: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      isActivatingTrial,
      selectPlan,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <>
        <H2>{intl.formatMessage(messages.teaserHeadline)}</H2>
        <p>{intl.formatMessage(messages.teaserText)}</p>
        <Button
          label={intl.formatMessage(messages.submitButtonLabel)}
          className={classes.activateTrialButton}
          busy={isActivatingTrial}
          onClick={selectPlan}
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
