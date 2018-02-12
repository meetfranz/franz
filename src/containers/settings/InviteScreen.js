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

  componentWillUnmount() {
    this.props.stores.user.inviteRequest.reset();
  }

  render() {
    const { actions } = this.props;
    const { user } = this.props.stores;

    return (
      <Invite
        onSubmit={actions.user.invite}
        isLoadingInvite={user.inviteRequest.isExecuting}
        isInviteSuccessful={user.inviteRequest.wasExecuted && !user.inviteRequest.isError}
        embed
      />
    );
  }
}

InviteScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.shape({
      invite: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.shape({
      inviteRequest: PropTypes.object,
    }).isRequired,
  }).isRequired,
};
