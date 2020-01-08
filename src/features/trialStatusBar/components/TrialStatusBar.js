import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { Icon } from '@meetfranz/ui';
import { mdiArrowRight, mdiWindowClose } from '@mdi/js';
import classnames from 'classnames';

import ProgressBar from './ProgressBar';

const messages = defineMessages({
  restTime: {
    id: 'feature.trialStatusBar.restTime',
    defaultMessage: '!!!Your Free Franz {plan} Trial ends in {time}.',
  },
  expired: {
    id: 'feature.trialStatusBar.expired',
    defaultMessage: '!!!Your free Franz {plan} Trial has expired, please upgrade your account.',
  },
  cta: {
    id: 'feature.trialStatusBar.cta',
    defaultMessage: '!!!Upgrade now',
  },
});

const styles = theme => ({
  root: {
    background: theme.trialStatusBar.bar.background,
    width: '100%',
    height: 25,
    order: 10,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    padding: [0, 10],
    justifyContent: 'flex-end',
  },
  ended: {
    background: theme.styleTypes.warning.accent,
    color: theme.styleTypes.warning.contrast,
  },
  message: {
    marginLeft: 20,
  },
  action: {
    marginLeft: 20,
    fontSize: 12,
    color: theme.colorText,
    textDecoration: 'underline',
    display: 'flex',

    '& svg': {
      margin: [1, 2, 0, 0],
    },
  },
});

@injectSheet(styles) @observer
class TrialStatusBar extends Component {
  static propTypes = {
    planName: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    upgradeAccount: PropTypes.func.isRequired,
    hideOverlay: PropTypes.func.isRequired,
    trialEnd: PropTypes.string.isRequired,
    hasEnded: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      planName,
      percent,
      upgradeAccount,
      hideOverlay,
      trialEnd,
      hasEnded,
      classes,
    } = this.props;

    const { intl } = this.context;

    return (
      <div
        className={classnames({
          [classes.root]: true,
          [classes.ended]: hasEnded,
        })}
      >
        <ProgressBar
          percent={percent}
        />
        {' '}
        <span className={classes.message}>
          {!hasEnded ? (
            intl.formatMessage(messages.restTime, {
              plan: planName,
              time: trialEnd,
            })
          ) : (
            intl.formatMessage(messages.expired, {
              plan: planName,
            })
          )}
        </span>
        <button
          className={classes.action}
          type="button"
          onClick={() => {
            upgradeAccount();
          }}
        >
          <Icon icon={mdiArrowRight} />
          {intl.formatMessage(messages.cta)}
        </button>
        <button
          className={classes.action}
          type="button"
          onClick={() => {
            hideOverlay();
          }}
        >
          <Icon icon={mdiWindowClose} />
        </button>
      </div>
    );
  }
}

export default TrialStatusBar;
