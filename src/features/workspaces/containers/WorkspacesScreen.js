import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { state } from '../state';
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
          workspaces={state.workspaces}
          isLoading={state.isLoading}
          onCreateWorkspaceSubmit={data => actions.workspace.create(data)}
          onWorkspaceClick={w => actions.workspace.edit({ workspace: w })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
