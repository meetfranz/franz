import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
// import { Link } from 'react-router';

// import Button from '../ui/Button';
import Loader from '../ui/Loader';
import Appear from '../ui/effects/Appear';
import SubscriptionForm from '../../containers/subscription/SubscriptionFormScreen';

const messages = defineMessages({
  headline: {
    id: 'pricing.headline',
    defaultMessage: '!!!Support Franz',
  },
  monthlySupportLabel: {
    id: 'pricing.support.label',
    defaultMessage: '!!!Select your support plan',
  },
  submitButtonLabel: {
    id: 'pricing.submit.label',
    defaultMessage: '!!!Support the development of Franz',
  },
  skipPayment: {
    id: 'pricing.link.skipPayment',
    defaultMessage: '!!!I don\'t want to support the development of Franz.',
  },
});

export default @observer class Signup extends Component {
  static propTypes = {
    donor: MobxPropTypes.objectOrObservableObject.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingUser: PropTypes.bool.isRequired,
    onCloseSubscriptionWindow: PropTypes.func.isRequired,
    skipAction: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      donor,
      isLoading,
      isLoadingUser,
      onCloseSubscriptionWindow,
      skipAction,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="auth__scroll-container">
        <div className="auth__container auth__container--signup">
          <form className="franz-form auth__form">
            <img
              src="./assets/images/sm.png"
              className="auth__logo auth__logo--sm"
              alt=""
            />
            <h1>{intl.formatMessage(messages.headline)}</h1>
            <div className="auth__letter">
              {isLoadingUser && (
                <p>Loading</p>
              )}
              {!isLoadingUser && (
                donor.amount ? (
                  <span>
                    <p>
                      Thank you so much for your previous donation of
                      {' '}
                      <strong>
                        $
                        {donor.amount}
                      </strong>
                      .
                      <br />
                      Your support allowed us to get where we are today.
                      <br />
                    </p>
                    <p>
                      As an early supporter, you get
                      {' '}
                      <strong>a lifetime premium supporter license</strong>
                      {' '}
                      without any
                      additional charges.
                    </p>
                    <p>
                      However, If you want to keep supporting us, you are more than welcome to subscribe to a plan.
                      <br />
                      <br />
                    </p>
                  </span>
                ) : (
                  <span>
                    <p>
                      We built Franz with a lot of effort, manpower and love,
                      to bring you the best messaging experience.
                      <br />
                    </p>
                    <p>
                      Getting a Franz Premium Supporter License will allow us to keep improving Franz for you.
                    </p>
                  </span>
                )
              )}
              <p>
                Thanks for being a hero.
              </p>
              <p>
                <strong>Stefan Malzner</strong>
              </p>
            </div>
            <Loader loaded={!isLoading}>
              <Appear transitionName="slideDown">
                <span className="label">{intl.formatMessage(messages.monthlySupportLabel)}</span>
                <SubscriptionForm
                  onCloseWindow={onCloseSubscriptionWindow}
                  showSkipOption
                  skipAction={skipAction}
                  hideInfo={Boolean(donor.amount)}
                  skipButtonLabel={intl.formatMessage(messages.skipPayment)}
                />
              </Appear>
            </Loader>
          </form>
        </div>
      </div>
    );
  }
}
