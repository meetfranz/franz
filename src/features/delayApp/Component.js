import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { gaEvent } from '../../lib/analytics';

import Button from '../../components/ui/Button';

import { config } from '.';
import styles from './styles';

const messages = defineMessages({
  headline: {
    id: 'feature.delayApp.headline',
    defaultMessage: '!!!Please purchase license to skip waiting',
  },
  action: {
    id: 'feature.delayApp.action',
    defaultMessage: '!!!Get a Franz Supporter License',
  },
  text: {
    id: 'feature.delayApp.text',
    defaultMessage: '!!!Franz will continue in {seconds} seconds.',
  },
});

export default @inject('actions') @injectSheet(styles) @observer class DelayApp extends Component {
  static propTypes = {
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    countdown: config.delayDuration,
  }

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
    const { actions } = this.props;

    actions.ui.openSettings({ path: 'user' });

    gaEvent('DelayApp', 'subscribe_click', 'Delay App Feature');
  }

  render() {
    const { classes } = this.props;
    const { intl } = this.context;

    return (
      <div className={`${classes.container}`}>
        <h1 className={classes.headline}>{intl.formatMessage(messages.headline)}</h1>
        <Button
          label={intl.formatMessage(messages.action)}
          className={classes.button}
          buttonType="inverted"
          onClick={this.handleCTAClick.bind(this)}
        />
        <p className="footnote">
          {intl.formatMessage(messages.text, {
            seconds: this.state.countdown / 1000,
          })}
        </p>
      </div>
    );
  }
}

DelayApp.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
