import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { Button } from '@meetfranz/forms';
import { Icon } from '@meetfranz/ui';
import { mdiArrowRight } from '@mdi/js';
import { gaEvent } from '../../lib/analytics';

// import Button from '../../components/ui/Button';

import { config, store, resetAppDelay } from '.';
import styles from './styles';
import UserStore from '../../stores/UserStore';

const messages = defineMessages({
  headline: {
    id: 'feature.delayApp.headline',
    defaultMessage: '!!!Please purchase license to skip waiting',
  },
  headlineTrial: {
    id: 'feature.delayApp.trial.headline',
    defaultMessage: '!!!Get the free Franz Professional 14 day trial and skip the line',
  },
  action: {
    id: 'feature.delayApp.upgrade.action',
    defaultMessage: '!!!Upgrade Franz',
  },
  actionTrial: {
    id: 'feature.delayApp.trial.action',
    defaultMessage: '!!!Yes, I want the free 14 day trial of Franz Professional',
  },
  text: {
    id: 'feature.delayApp.text',
    defaultMessage: '!!!Franz will continue in {seconds} seconds.',
  },
  continueInText: {
    id: 'feature.delayApp.continueInText',
    defaultMessage: '!!!You can continue with Franz in {seconds} seconds.',
  },
  continuing: {
    id: 'feature.delayApp.continuing',
    defaultMessage: '!!!Continuing Franz',
  },
  continueWithApp: {
    id: 'feature.delayApp.continueWithApp',
    defaultMessage: '!!!Continue to Franz',
  },
  poweredByIntro: {
    id: 'feature.delayApp.poweredByIntro',
    defaultMessage: '!!!Franz is proudly powered by:',
  },
  advertisingDisclaimer: {
    id: 'feature.delayApp.adDisclaimer',
    defaultMessage: '!!!Advertising',
  },
  poweredByDefaultCTA: {
    id: 'feature.delayApp.poweredByDefaultCTA',
    defaultMessage: '!!!Read more',
  },
  poweredByDontShowAdsCTA: {
    id: 'feature.delayApp.poweredByDontShowAdsCTA',
    defaultMessage: '!!!Don\'t show ads',
  },
  poweredByPlaceAd: {
    id: 'feature.delayApp.poweredByPlaceAd',
    defaultMessage: '!!!Place your ad here',
  },
});

@inject('stores', 'actions') @injectSheet(styles) @observer class DelayApp extends Component {
  static propTypes = {
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    countdown: config.delayDuration,
  };

  countdownInterval = null;

  countdownIntervalTimeout = 1000;

  componentDidMount() {
    this.countdownInterval = setInterval(() => {
      this.setState(prevState => ({
        countdown: prevState.countdown - this.countdownIntervalTimeout,
      }));

      if (this.state.countdown <= 0) {
        // reload();
        clearInterval(this.countdownInterval);
      }
    }, this.countdownIntervalTimeout);
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  handleCTAClick() {
    const { actions, stores } = this.props;
    const { hadSubscription } = stores.user.data;
    const { defaultTrialPlan } = stores.features.features;

    if (!hadSubscription) {
      actions.user.activateTrial({ planId: defaultTrialPlan });

      gaEvent('DelayApp', 'subscribe_click', 'Delay App Feature');
    } else {
      actions.ui.openSettings({ path: 'user' });

      gaEvent('DelayApp', 'subscribe_click', 'Delay App Feature');
    }
  }

  render() {
    const { classes, stores, actions } = this.props;
    const { intl } = this.context;

    const { showPoweredBy, needToClick } = stores.features.features.needToWaitToProceedConfig;

    const { hadSubscription } = stores.user.data;
    return (
      <div className={`${classes.container}`}>
        <div className={`${classes.content}`}>
          <h1 className={classes.headline}>{intl.formatMessage(hadSubscription ? messages.headline : messages.headlineTrial)}</h1>
          <Button
            label={intl.formatMessage(hadSubscription ? messages.action : messages.actionTrial)}
            className={classes.button}
            buttonType="inverted"
            onClick={this.handleCTAClick.bind(this)}
            busy={stores.user.activateTrialRequest.isExecuting}
          />

          <p className={`footnote ${classes.countdown}`}>
            {this.state.countdown > 0 ? (
              intl.formatMessage(needToClick ? messages.continueInText : messages.text, {
                seconds: this.state.countdown / 1000,
              })
            ) : (
              <>
                {!needToClick ? intl.formatMessage(messages.continuing) : (
                  <button
                    type="button"
                    onClick={() => {
                      resetAppDelay();
                      gaEvent('DelayApp', 'reset', 'Continue to Franz');
                    }}
                    className={classes.continueCTA}
                  >
                    {intl.formatMessage(messages.continueWithApp)}
                  </button>
                )}
              </>
            )}
          </p>
        </div>
        {showPoweredBy && store.poweredBy && store.poweredBy.id && (
          <div className={classes.poweredBy}>
            <p className={classes.poweredByIntro}>
              {intl.formatMessage(messages.advertisingDisclaimer)}
            </p>
            <div
              className={classes.poweredByContainer}
              type="button"
            >
              <div className={classes.poweredByContentContainer}>
                <img src={store.poweredBy.logo} alt={`${store.poweredBy.name} Logo`} className={classes.poweredByLogo} />
                {/* <p className={classes.poweredByName}>
                  {store.poweredBy.name}
                </p> */}
                <div className={classes.poweredByContent}>
                  <p className={classes.poweredByDescription}>
                    <strong>{store.poweredBy.name}</strong>
                    {' '}
—
                    {' '}
                    {store.poweredBy.description}
                  </p>
                  <button
                    className={classes.poweredByCTA}
                    onClick={() => {
                      actions.app.openExternalUrl({ url: store.poweredBy.url });

                      gaEvent('PoweredBy', 'clickCTA', store.poweredBy.id);
                    }}
                    type="button"
                  >
                    <Icon icon={mdiArrowRight} />
                    <span>
                      {store.poweredBy.cta || intl.formatMessage(messages.poweredByDefaultCTA)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className={classes.poweredByActionsContainer}>
              <button
                type="button"
                className={classes.skipAds}
                onClick={() => {
                  actions.ui.openSettings({ path: 'user' });

                  gaEvent('PoweredBy', 'click', 'skip');
                }}
              >
                {intl.formatMessage(messages.poweredByDontShowAdsCTA)}
              </button>
              <button
                type="button"
                className={classes.skipAds}
                onClick={() => {
                  actions.app.openExternalUrl({ url: 'https://meetfranz.com/ads' });

                  gaEvent('PoweredBy', 'click', 'placeAd');
                }}
              >
                {intl.formatMessage(messages.poweredByPlaceAd)}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DelayApp.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DelayApp;
