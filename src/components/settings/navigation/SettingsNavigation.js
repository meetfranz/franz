import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';

import Link from '../../ui/Link';

const messages = defineMessages({
  availableServices: {
    id: 'settings.navigation.availableServices',
    defaultMessage: '!!!Available services',
  },
  yourServices: {
    id: 'settings.navigation.yourServices',
    defaultMessage: '!!!Your services',
  },
  account: {
    id: 'settings.navigation.account',
    defaultMessage: '!!!Account',
  },
  settings: {
    id: 'settings.navigation.settings',
    defaultMessage: '!!!Settings',
  },
  inviteFriends: {
    id: 'settings.navigation.inviteFriends',
    defaultMessage: '!!!Invite Friends',
  },
  logout: {
    id: 'settings.navigation.logout',
    defaultMessage: '!!!Logout',
  },
});

@inject('stores') @observer
export default class SettingsNavigation extends Component {
  static propTypes = {
    serviceCount: PropTypes.number.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { serviceCount } = this.props;
    const { data: user } = this.props.stores.user;
    const { intl } = this.context;

    return (
      <div className="settings-navigation">
        {user.clientSettings && user.clientSettings.userCanManageServices && (
          <Link
            to="/settings/recipes"
            className="settings-navigation__link"
            activeClassName="is-active"
          >
            {intl.formatMessage(messages.availableServices)}
          </Link>
        )}
        <Link
          to="/settings/services"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.yourServices)} <span className="badge">{serviceCount}</span>
        </Link>
        <Link
          to="/settings/user"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.account)}
        </Link>
        <Link
          to="/settings/app"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.settings)}
        </Link>
        <Link
          to="/settings/invite"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.inviteFriends)}
        </Link>
        <span className="settings-navigation__expander" />
        <Link
          to="/auth/logout"
          className="settings-navigation__link"
        >
          {intl.formatMessage(messages.logout)}
        </Link>
      </div>
    );
  }
}

SettingsNavigation.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.shape({
      data: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

