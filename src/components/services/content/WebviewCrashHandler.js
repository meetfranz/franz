import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Button from '../../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'service.crashHandler.headline',
    defaultMessage: '!!!Oh no!',
  },
  text: {
    id: 'service.crashHandler.text',
    defaultMessage: '!!!{name} has caused an error.',
  },
  action: {
    id: 'service.crashHandler.action',
    defaultMessage: '!!!Reload {name}',
  },
  autoReload: {
    id: 'service.crashHandler.autoReload',
    defaultMessage: '!!!Trying to automatically restore {name} in {seconds} seconds',
  },
});

export default @observer class WebviewCrashHandler extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    countdown: 10000,
  }

  countdownInterval = null;

  countdownIntervalTimeout = 1000;


  componentDidMount() {
    const { reload } = this.props;

    this.countdownInterval = setInterval(() => {
      this.setState(prevState => ({
        countdown: prevState.countdown - this.countdownIntervalTimeout,
      }));

      if (this.state.countdown <= 0) {
        reload();
        clearInterval(this.countdownInterval);
      }
    }, this.countdownIntervalTimeout);
  }

  render() {
    const { name, reload } = this.props;
    const { intl } = this.context;

    return (
      <div className="services__info-layer">
        <h1>{intl.formatMessage(messages.headline)}</h1>
        <p>{intl.formatMessage(messages.text, { name })}</p>
        <Button
          // label={`Reload ${name}`}
          label={intl.formatMessage(messages.action, { name })}
          buttonType="inverted"
          onClick={() => reload()}
        />
        <p className="footnote">
          {intl.formatMessage(messages.autoReload, {
            name,
            seconds: this.state.countdown / 1000,
          })}
        </p>
      </div>
    );
  }
}
