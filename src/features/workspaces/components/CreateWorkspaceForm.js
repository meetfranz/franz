import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Input, Button } from '@meetfranz/forms';
import injectSheet from 'react-jss';

import Form from '../../../lib/Form';

const messages = defineMessages({
  submitButton: {
    id: 'settings.workspace.add.form.submitButton',
    defaultMessage: '!!!Save workspace',
  },
  name: {
    id: 'settings.workspace.add.form.name',
    defaultMessage: '!!!Name',
  },
});

const styles = () => ({
  form: {
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    marginRight: '10px',
  },
  submitButton: {
    height: 'inherit',
    marginTop: '17px',
  },
});

@observer @injectSheet(styles)
class CreateWorkspaceForm extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  prepareForm() {
    const { intl } = this.context;
    const config = {
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: '',
        },
      },
    };
    return new Form(config);
  }

  submitForm(form) {
    form.submit({
      onSuccess: async (f) => {
        const { onSubmit } = this.props;
        const values = f.values();
        onSubmit(values);
      },
      onError: async () => {},
    });
  }

  render() {
    const { intl } = this.context;
    const { classes } = this.props;
    const form = this.prepareForm();

    return (
      <div className={classes.form}>
        <Input
          className={classes.input}
          {...form.$('name').bind()}
          onEnterKey={this.submitForm.bind(this, form)}
        />
        <Button
          className={classes.submitButton}
          type="button"
          label={intl.formatMessage(messages.submitButton)}
          onClick={this.submitForm.bind(this, form)}
        />
      </div>
    );
  }
}

export default CreateWorkspaceForm;
