import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { defineMessages, intlShape } from 'react-intl';

import Tabbar from '../services/tabs/Tabbar';
import { ctrlKey } from '../../environment';

const messages = defineMessages({
  settings: {
    id: 'sidebar.settings',
    defaultMessage: '!!!Settings',
  },
});

export default class Sidebar extends Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    isPremiumUser: PropTypes.bool,
  }

  static defaultProps = {
    isPremiumUser: false,
  }

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    tooltipEnabled: true,
  };

  enableToolTip() {
    this.setState({ tooltipEnabled: true });
  }

  disableToolTip() {
    this.setState({ tooltipEnabled: false });
  }

  render() {
    const { openSettings, isPremiumUser } = this.props;
    const { intl } = this.context;
    return (
      <div className="sidebar">
        <Tabbar
          {...this.props}
          enableToolTip={() => this.enableToolTip()}
          disableToolTip={() => this.disableToolTip()}
        />
        <button
          onClick={openSettings}
          className="sidebar__settings-button"
          data-tip={`${intl.formatMessage(messages.settings)} (${ctrlKey}+,)`}
        >
          {isPremiumUser && (
            <span className="emoji">
              <img src="./assets/images/emoji/star.png" alt="" />
            </span>
          )}
          <img
            src="./assets/images/logo.svg"
            className="sidebar__logo"
            alt=""
          />
          {intl.formatMessage(messages.settings)}
        </button>
        {this.state.tooltipEnabled && (
          <ReactTooltip place="right" type="dark" effect="solid" />
        )}
      </div>
    );
  }
}
