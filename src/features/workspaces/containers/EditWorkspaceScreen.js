import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { gaPage } from '../../../lib/analytics';
import { state } from '../state';
import EditWorkspaceForm from '../components/EditWorkspaceForm';

@inject('stores', 'actions') @observer
class EditWorkspaceScreen extends Component {
  componentDidMount() {
    gaPage('Settings/Workspace/Edit');
  }

  onDelete = () => {
    console.log('delete workspace');
  };

  onSave = (values) => {
    console.log('save workspace', values);
  };

  render() {
    const { workspaceBeingEdited } = state;
    if (!workspaceBeingEdited) return null;
    return (
      <ErrorBoundary>
        <EditWorkspaceForm
          workspace={workspaceBeingEdited}
          onDelete={this.onDelete}
          onSave={this.onSave}
          isDeleting={false}
          isSaving={false}
        />
      </ErrorBoundary>
    );
  }
}

export default EditWorkspaceScreen;
