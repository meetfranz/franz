import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { H2, Loader } from '@meetfranz/ui';
import classnames from 'classnames';

import { Button } from '@meetfranz/forms';
import { FeatureItem } from '../ui/FeatureItem';
import { FeatureList } from '../ui/FeatureList';


const messages = defineMessages({
  headline: {
    id: 'pricing.trial.headline',
    defaultMessage: '!!!Franz Professional',
  },
  personalOffer: {
    id: 'pricing.trial.subheadline',
    defaultMessage: '!!!Your personal welcome offer:',
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
  activationError: {
    id: 'pricing.trial.error',
    defaultMessage: '!!!Sorry, we could not activate your trial!',
  },
  ctaAccept: {
    id: 'pricing.trial.cta.accept',
    defaultMessage: '!!!Yes, upgrade my account to Franz Professional',
  },
  ctaSkip: {
    id: 'pricing.trial.cta.skip',
    defaultMessage: '!!!Continue to Franz',
  },
  featuresHeadline: {
    id: 'pricing.trial.features.headline',
    defaultMessage: '!!!Franz Professional includes:',
  },
});

const styles = theme => ({
  container: {
    position: 'relative',
    marginLeft: -150,
  },
  welcomeOffer: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  keyTerms: {
    textAlign: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 20,
  },
  featureContainer: {
    width: 300,
    position: 'absolute',
    left: 'calc(100% / 2 + 225px)',
    top: 155,
    background: theme.signup.pricing.feature.background,
    height: 'auto',
    padding: 20,
    borderTopRightRadius: theme.borderRadius,
    borderBottomRightRadius: theme.borderRadius,
    zIndex: 10,
  },
  featureItem: {
    borderBottom: [1, 'solid', theme.signup.pricing.feature.border],
  },
  cta: {
    marginTop: 40,
    width: '100%',
  },
  skipLink: {
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    margin: [20, 0, 0],
    color: theme.styleTypes.danger.accent,
  },
});

export default @observer @injectSheet(styles) class Signup extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoadingRequiredData: PropTypes.bool.isRequired,
    isActivatingTrial: PropTypes.bool.isRequired,
    trialActivationError: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      onSubmit,
      isLoadingRequiredData,
      isActivatingTrial,
      trialActivationError,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className={classnames('auth__scroll-container', classes.container)}>
        <div className={classnames('auth__container', 'auth__container--signup', classes.content)}>
          <form className="franz-form auth__form">
            {isLoadingRequiredData ? <Loader /> : (
              <img
                src="./assets/images/sm.png"
                className="auth__logo auth__logo--sm"
                alt=""
              />
            )}
            <p className={classes.welcomeOffer}>{intl.formatMessage(messages.personalOffer)}</p>
            <h1>{intl.formatMessage(messages.headline)}</h1>
            <div className="auth__letter">
              <p>
                We built Franz with a lot of effort, manpower and love,
                to boost up your messaging experience.
                <br />
              </p>
              <p>
                Get the free 14 day Franz Professional trial and see your communication evolving.
                <br />
              </p>
              <p>
                Thanks for being a hero.
              </p>
              <p>
                <strong>Stefan Malzner</strong>
              </p>
            </div>
            <div className={classes.keyTerms}>
              <H2>
                {intl.formatMessage(messages.noStringsAttachedHeadline)}
              </H2>
              <ul className={classes.keyTermsList}>
                <FeatureItem icon="👉" name={intl.formatMessage(messages.noCreditCard)} />
                <FeatureItem icon="👉" name={intl.formatMessage(messages.automaticTrialEnd)} />
              </ul>
            </div>
            {trialActivationError && (
              <p className={classes.error}>{intl.formatMessage(messages.activationError)}</p>
            )}
            <Button
              label={intl.formatMessage(messages.ctaAccept)}
              className={classes.cta}
              onClick={onSubmit}
              busy={isActivatingTrial}
              disabled={isLoadingRequiredData || isActivatingTrial}
            />
            <p className={classes.skipLink}>
              <a href="#/">{intl.formatMessage(messages.ctaSkip)}</a>
            </p>
          </form>
        </div>
        <div className={classes.featureContainer}>
          <H2>
            {intl.formatMessage(messages.featuresHeadline)}
          </H2>
          {/* <ul className={classes.features}>
            <FeatureItem name="Add unlimited services" className={classes.featureItem} />
            <FeatureItem name="Spellchecker support" className={classes.featureItem} />
            <FeatureItem name="Workspaces" className={classes.featureItem} />
            <FeatureItem name="Add Custom Websites" className={classes.featureItem} />
            <FeatureItem name="On-premise & other Hosted Services" className={classes.featureItem} />
            <FeatureItem name="Install 3rd party services" className={classes.featureItem} />
            <FeatureItem name="Service Proxies" className={classes.featureItem} />
            <FeatureItem name="Team Management" className={classes.featureItem} />
            <FeatureItem name="No Waiting Screens" className={classes.featureItem} />
            <FeatureItem name="Forever ad-free" className={classes.featureItem} />
          </ul> */}
          <FeatureList />
        </div>
      </div>
    );
  }
}
