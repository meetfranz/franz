import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import WorkspacesDashboard from '../components/WorkspacesDashboard';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { workspaceStore } from '../index';
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  getUserWorkspacesRequest,
  updateWorkspaceRequest,
} from '../api';
import UserStore from '../../../stores/UserStore';

@inject('stores', 'actions') @observer
class WorkspacesScreen extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      user: PropTypes.instanceOf(UserStore),
    }).isRequired,
    actions: PropTypes.shape({
      workspace: PropTypes.shape({
        edit: PropTypes.func.isRequired,
      }),
      ui: PropTypes.shape({
        openSettings: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { stores, actions } = this.props;
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={workspaceStore.workspaces}
          isPersonalUser={stores.user.isPersonal}
          getUserWorkspacesRequest={getUserWorkspacesRequest}
          createWorkspaceRequest={createWorkspaceRequest}
          deleteWorkspaceRequest={deleteWorkspaceRequest}
          updateWorkspaceRequest={updateWorkspaceRequest}
          onCreateWorkspaceSubmit={data => actions.workspaces.create(data)}
          onWorkspaceClick={w => actions.workspaces.edit({ workspace: w })}
          onUpgradeAccount={() => actions.ui.openSettings({ path: 'user' })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
