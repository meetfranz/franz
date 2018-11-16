import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Invite from '../../components/auth/Invite';
import { gaPage } from '../../lib/analytics';

export default @inject('stores', 'actions') @observer class InviteScreen extends Component {
  componentDidMount() {
    gaPage('Auth/Invite');
  }

  render() {
    const { actions } = this.props;

    return (
      <Invite
        onSubmit={actions.user.invite}
        embed={false}
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
};
