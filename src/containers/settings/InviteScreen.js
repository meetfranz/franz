import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Invite from '../../components/auth/Invite';
import ErrorBoundary from '../../components/util/ErrorBoundary';

export default @inject('stores', 'actions') @observer class InviteScreen extends Component {
  componentWillUnmount() {
    this.props.stores.user.inviteRequest.reset();
  }

  render() {
    const { actions } = this.props;
    const { user } = this.props.stores;

    return (
      <ErrorBoundary>
        <Invite
          onSubmit={actions.user.invite}
          isLoadingInvite={user.inviteRequest.isExecuting}
          isInviteSuccessful={user.inviteRequest.wasExecuted && !user.inviteRequest.isError}
          embed
        />
      </ErrorBoundary>
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
