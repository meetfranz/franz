import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { Input, Button } from '@meetfranz/forms';
import injectSheet from 'react-jss';

import Workspace from '../models/Workspace';
import Service from '../../../models/Service';
import Form from '../../../lib/Form';
import { required } from '../../../helpers/validation-helpers';
import ServiceListItem from './ServiceListItem';
import Request from '../../../stores/lib/Request';

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
  servicesInWorkspaceHeadline: {
    id: 'settings.workspace.form.servicesInWorkspaceHeadline',
    defaultMessage: '!!!Services in this Workspace',
  },
});

const styles = () => ({
  nameInput: {
    height: 'auto',
  },
  serviceList: {
    height: 'auto',
  },
});

@injectSheet(styles) @observer
class EditWorkspaceForm extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    updateWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
    deleteWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
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
        services: {
          value: workspace.services.slice(),
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

  toggleService(service) {
    const servicesField = this.form.$('services');
    const serviceIds = servicesField.value;
    if (serviceIds.includes(service.id)) {
      serviceIds.splice(serviceIds.indexOf(service.id), 1);
    } else {
      serviceIds.push(service.id);
    }
    servicesField.set(serviceIds);
  }

  render() {
    const { intl } = this.context;
    const {
      classes,
      onDelete,
      workspace,
      services,
      deleteWorkspaceRequest,
      updateWorkspaceRequest,
    } = this.props;
    const { form } = this;
    const workspaceServices = form.$('services').value;
    const isDeleting = deleteWorkspaceRequest.isExecuting;
    const isSaving = updateWorkspaceRequest.isExecuting;
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
          <h2>{intl.formatMessage(messages.servicesInWorkspaceHeadline)}</h2>
          <div className={classes.serviceList}>
            {services.map(s => (
              <ServiceListItem
                key={s.id}
                service={s}
                isInWorkspace={workspaceServices.includes(s.id)}
                onToggle={() => this.toggleService(s)}
              />
            ))}
          </div>
        </div>
        <div className="settings__controls">
          {/* ===== Delete Button ===== */}
          <Button
            label={intl.formatMessage(messages.buttonDelete)}
            loaded={false}
            busy={isDeleting}
            buttonType={isDeleting ? 'secondary' : 'danger'}
            className="settings__delete-button"
            disabled={isDeleting}
            onClick={onDelete}
          />
          {/* ===== Save Button ===== */}
          <Button
            type="submit"
            label={intl.formatMessage(messages.buttonSave)}
            busy={isSaving}
            buttonType={isSaving ? 'secondary' : 'primary'}
            onClick={this.submitForm.bind(this, form)}
            disabled={isSaving}
          />
        </div>
      </div>
    );
  }
}

export default EditWorkspaceForm;
