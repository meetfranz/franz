import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { ProBadge } from '@meetfranz/ui';

import Link from '../../ui/Link';
import { workspaceStore } from '../../../features/workspaces';
import UIStore from '../../../stores/UIStore';
import UserStore from '../../../stores/UserStore';
import { serviceLimitStore } from '../../../features/serviceLimit';

const messages = defineMessages({
  availableServices: {
    id: 'settings.navigation.availableServices',
    defaultMessage: '!!!Available services',
  },
  yourServices: {
    id: 'settings.navigation.yourServices',
    defaultMessage: '!!!Your services',
  },
  yourWorkspaces: {
    id: 'settings.navigation.yourWorkspaces',
    defaultMessage: '!!!Your workspaces',
  },
  account: {
    id: 'settings.navigation.account',
    defaultMessage: '!!!Account',
  },
  team: {
    id: 'settings.navigation.team',
    defaultMessage: '!!!Manage Team',
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

export default @inject('stores') @observer class SettingsNavigation extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      ui: PropTypes.instanceOf(UIStore).isRequired,
      user: PropTypes.instanceOf(UserStore).isRequired,
    }).isRequired,
    serviceCount: PropTypes.number.isRequired,
    workspaceCount: PropTypes.number.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { serviceCount, workspaceCount, stores } = this.props;
    const { isDarkThemeActive } = stores.ui;
    const { router, user } = stores;
    const { intl } = this.context;

    return (
      <div className="settings-navigation">
        <Link
          to="/settings/recipes"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.availableServices)}
        </Link>
        <Link
          to="/settings/services"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.yourServices)}
          {' '}
          <span className="badge">
            {serviceCount}
            {serviceLimitStore.serviceLimit !== 0 && (
              `/${serviceLimitStore.serviceLimit}`
            )}
          </span>
        </Link>
        {workspaceStore.isFeatureEnabled ? (
          <Link
            to="/settings/workspaces"
            className="settings-navigation__link"
            activeClassName="is-active"
          >
            {intl.formatMessage(messages.yourWorkspaces)}
            {' '}
            {workspaceStore.isPremiumUpgradeRequired ? (
              <ProBadge inverted={!isDarkThemeActive && workspaceStore.isSettingsRouteActive} />
            ) : (
              <span className="badge">{workspaceCount}</span>
            )}
          </Link>
        ) : null}
        <Link
          to="/settings/user"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.account)}
        </Link>
        <Link
          to="/settings/team"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.team)}
          {!user.data.isPremium && (
            <ProBadge inverted={!isDarkThemeActive && router.location.pathname === '/settings/team'} />
          )}
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
