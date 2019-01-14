import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import Form from '../../lib/Form';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { gaPage } from '../../lib/analytics';
import { state } from '../../features/workspaces/state';

const messages = defineMessages({
  name: {
    id: 'settings.workspace.form.name',
    defaultMessage: '!!!Name',
  },
});

@inject('stores', 'actions') @observer
class EditWorkspaceScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    gaPage('Settings/Workspace/Edit');
  }

  prepareForm(workspace) {
    const { intl } = this.context;
    const config = {
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: workspace.name,
        },
      },
    };
    return new Form(config);
  }

  render() {
    const { workspaceBeingEdited } = state;
    if (!workspaceBeingEdited) return null;

    // const form = this.prepareForm(workspaceBeingEdited);

    return (
      <ErrorBoundary>
        <div>{workspaceBeingEdited.name}</div>
      </ErrorBoundary>
    );
  }
}

export default EditWorkspaceScreen;
