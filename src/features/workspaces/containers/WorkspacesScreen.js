import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { workspacesState } from '../state';
import WorkspacesDashboard from '../components/WorkspacesDashboard';
import ErrorBoundary from '../../../components/util/ErrorBoundary';

@inject('actions') @observer
class WorkspacesScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspace: PropTypes.shape({
        edit: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { actions } = this.props;
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={workspacesState.workspaces}
          isLoading={workspacesState.isLoadingWorkspaces}
          onCreateWorkspaceSubmit={data => actions.workspaces.create(data)}
          onWorkspaceClick={w => actions.workspaces.edit({ workspace: w })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
