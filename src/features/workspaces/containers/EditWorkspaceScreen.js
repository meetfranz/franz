import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import Form from '../../../lib/Form';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { gaPage } from '../../../lib/analytics';
import { state } from '../state';

const messages = defineMessages({
  name: {
    id: 'settings.workspace.form.name',
    defaultMessage: '!!!Name',
  },
  yourWorkspaces: {
    id: 'settings.workspace.form.yourWorkspaces',
    defaultMessage: '!!!Your workspaces',
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
    const { intl } = this.context;
    const { workspaceBeingEdited } = state;
    if (!workspaceBeingEdited) return null;

    // const form = this.prepareForm(workspaceBeingEdited);

    return (
      <ErrorBoundary>
        <div className="settings__main">
          <div className="settings__header">
            <span className="settings__header-item">
              <Link to="/settings/workspaces">
                {intl.formatMessage(messages.yourWorkspaces)}
              </Link>
            </span>
            <span className="separator" />
            <span className="settings__header-item">
              {workspaceBeingEdited.name}
            </span>
          </div>
          <div className="settings__body">
            test
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default EditWorkspaceScreen;
