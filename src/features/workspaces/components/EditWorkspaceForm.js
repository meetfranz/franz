import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { Input, Button } from '@meetfranz/forms';
import injectSheet from 'react-jss';

import Workspace from '../models/Workspace';
import Form from '../../../lib/Form';
import { required } from '../../../helpers/validation-helpers';

const messages = defineMessages({
  buttonDelete: {
    id: 'settings.workspace.form.buttonDelete',
    defaultMessage: '!!!Delete workspace',
  },
  buttonSave: {
    id: 'settings.workspace.form.buttonSave',
    defaultMessage: '!!!Save workspace',
  },
  name: {
    id: 'settings.workspace.form.name',
    defaultMessage: '!!!Name',
  },
  yourWorkspaces: {
    id: 'settings.workspace.form.yourWorkspaces',
    defaultMessage: '!!!Your workspaces',
  },
});

const styles = () => ({
  nameInput: {
    height: 'auto',
  },
});

@injectSheet(styles) @observer
class EditWorkspaceForm extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  static propTypes = {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
  };

  form = this.prepareWorkspaceForm(this.props.workspace);

  componentWillReceiveProps(nextProps) {
    const { workspace } = this.props;
    if (workspace.id !== nextProps.workspace.id) {
      this.form = this.prepareWorkspaceForm(nextProps.workspace);
    }
  }

  prepareWorkspaceForm(workspace) {
    const { intl } = this.context;
    return new Form({
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: workspace.name,
          validators: [required],
        },
      },
    });
  }

  submitForm(form) {
    form.submit({
      onSuccess: async (f) => {
        const { onSave } = this.props;
        const values = f.values();
        onSave(values);
      },
      onError: async () => {},
    });
  }

  render() {
    const { intl } = this.context;
    const {
      classes,
      isDeleting,
      isSaving,
      onDelete,
      workspace,
    } = this.props;
    const { form } = this;
    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            <Link to="/settings/workspaces">
              {intl.formatMessage(messages.yourWorkspaces)}
            </Link>
          </span>
          <span className="separator" />
          <span className="settings__header-item">
            {workspace.name}
          </span>
        </div>
        <div className="settings__body">
          <div className={classes.nameInput}>
            <Input {...form.$('name').bind()} />
          </div>
        </div>
        <div className="settings__controls">
          {/* ===== Delete Button ===== */}
          {isDeleting ? (
            <Button
              label={intl.formatMessage(messages.buttonDelete)}
              loaded={false}
              buttonType="secondary"
              className="settings__delete-button"
              disabled
            />
          ) : (
            <Button
              buttonType="danger"
              label={intl.formatMessage(messages.buttonDelete)}
              className="settings__delete-button"
              onClick={onDelete}
            />
          )}
          {/* ===== Save Button ===== */}
          {isSaving ? (
            <Button
              type="submit"
              label={intl.formatMessage(messages.buttonSave)}
              loaded={!isSaving}
              buttonType="secondary"
              disabled
            />
          ) : (
            <Button
              type="submit"
              label={intl.formatMessage(messages.buttonSave)}
              onClick={this.submitForm.bind(this, form)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default EditWorkspaceForm;
