import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../../components/util/ErrorBoundary';
import EditWorkspaceForm from '../components/EditWorkspaceForm';
import { state } from '../state';
import ServicesStore from '../../../stores/ServicesStore';
import Workspace from '../models/Workspace';

@inject('stores', 'actions') @observer
class EditWorkspaceScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspace: PropTypes.shape({
        delete: PropTypes.func.isRequired,
      }),
    }).isRequired,
    stores: PropTypes.shape({
      services: PropTypes.instanceOf(ServicesStore).isRequired,
    }).isRequired,
  };

  onDelete = () => {
    const { workspaceBeingEdited } = state;
    const { actions } = this.props;
    if (!workspaceBeingEdited) return null;
    actions.workspace.delete({ workspace: workspaceBeingEdited });
  };

  onSave = (values) => {
    const { workspaceBeingEdited } = state;
    const { actions } = this.props;
    const workspace = new Workspace(
      Object.assign({}, workspaceBeingEdited, values),
    );
    actions.workspace.update({ workspace });
  };

  render() {
    const { workspaceBeingEdited } = state;
    const { stores } = this.props;
    if (!workspaceBeingEdited) return null;
    return (
      <ErrorBoundary>
        <EditWorkspaceForm
          workspace={workspaceBeingEdited}
          services={stores.services.all}
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
