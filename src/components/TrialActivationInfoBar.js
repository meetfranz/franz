import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import ms from 'ms';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import InfoBar from './ui/InfoBar';

const messages = defineMessages({
  message: {
    id: 'infobar.trialActivated',
    defaultMessage: '!!!Your trial was successfully activated. Happy messaging!',
  },
});

const styles = {
  notification: {
    height: 'auto',
    position: 'absolute',
    top: -50,
    transition: 'top 0.3s',
    zIndex: 500,
    width: 'calc(100% - 300px)',
  },
  show: {
    top: 0,
  },
};

@injectSheet(styles)
class TrialActivationInfoBar extends Component {
  static propTypes = {
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    showing: false,
    removed: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showing: true,
      });
    }, 0);

    setTimeout(() => {
      this.setState({
        showing: false,
      });
    }, ms('6s'));

    setTimeout(() => {
      this.setState({
        removed: true,
      });
    }, ms('7s'));
  }

  render() {
    const { classes } = this.props;
    const { showing, removed } = this.state;
    const { intl } = this.context;

    if (removed) return null;

    return (
      <div
        className={classnames({
          [classes.notification]: true,
          [classes.show]: showing,
        })}
      >
        <InfoBar
          type="primary"
          position="top"
          sticky
        >
          <span className="mdi mdi-information" />
          {intl.formatMessage(messages.message)}
        </InfoBar>
      </div>
    );
  }
}

export default TrialActivationInfoBar;
