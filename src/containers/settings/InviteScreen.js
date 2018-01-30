import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Invite from '../../components/auth/Invite';
import { gaPage } from '../../lib/analytics';

@inject('stores', 'actions') @observer
export default class InviteScreen extends Component {
  componentDidMount() {
    gaPage('Settings/Invite');
  }

  render() {
    const {
      actions,
      location,
    } = this.props;

    return (
      <div className="settings__main">
        <div className="settings__header">
          {/* <h1>{intl.formatMessage(messages.headline)}</h1> */}
          <h1>Invite Friends</h1>
        </div>
        <div className="settings__body invite__form">
          <Invite
            onSubmit={actions.user.invite}
            from={location.query.from}
            embed={location.query.embed}
          />
        </div>
      </div>
    );
  }
}

InviteScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.shape({
      invite: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      from: PropTypes.string,
    }),
  }).isRequired,
};
