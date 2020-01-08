import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import UserStore from '../../stores/UserStore';
import AppStore from '../../stores/AppStore';

import TeamDashboard from '../../components/settings/team/TeamDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { WEBSITE } from '../../environment';

export default @inject('stores', 'actions') @observer class TeamScreen extends Component {
  handleWebsiteLink(route) {
    const { actions, stores } = this.props;

    const url = `${WEBSITE}${route}?authToken=${stores.user.authToken}&utm_source=app&utm_medium=account_dashboard`;

    actions.app.openExternalUrl({ url });
  }

  render() {
    const { user } = this.props.stores;

    const isLoadingUserInfo = user.getUserInfoRequest.isExecuting;

    return (
      <ErrorBoundary>
        <TeamDashboard
          isLoading={isLoadingUserInfo}
          userInfoRequestFailed={user.getUserInfoRequest.wasExecuted && user.getUserInfoRequest.isError}
          retryUserInfoRequest={() => this.reloadData()}
          openTeamManagement={() => this.handleWebsiteLink('/user/team')}
          isProUser={user.isPro}
        />
      </ErrorBoundary>
    );
  }
}

TeamScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    payment: PropTypes.shape({
      createDashboardUrl: PropTypes.func.isRequired,
    }).isRequired,
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
