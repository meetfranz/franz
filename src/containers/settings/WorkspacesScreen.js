import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { gaPage } from '../../lib/analytics';
import { state } from '../../features/workspaces/state';

import WorkspacesDashboard from '../../components/settings/workspaces/WorkspacesDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';

@observer
class WorkspacesScreen extends Component {
  static propTypes = {};

  componentDidMount() {
    gaPage('Settings/Workspaces Dashboard');
  }

  render() {
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={state.workspaces}
          isLoading={state.isLoading}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
