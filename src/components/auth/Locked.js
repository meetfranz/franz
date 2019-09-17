import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import { required } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'locked.headline',
    defaultMessage: '!!!Locked',
  },
  info: {
    id: 'locked.info',
    defaultMessage: '!!!Ferdi is currently locked. Please unlock Ferdi with your password to see your messages.',
  },
  passwordLabel: {
    id: 'locked.password.label',
    defaultMessage: '!!!Password',
  },
  submitButtonLabel: {
    id: 'locked.submit.label',
    defaultMessage: '!!!Unlock',
  },
  invalidCredentials: {
    id: 'locked.invalidCredentials',
    defaultMessage: '!!!Password invalid',
  },
});

export default @observer class Locked extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    error: globalErrorPropType.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validators: [required],
        type: 'password',
      },
    },
  }, this.context.intl);

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => { },
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      isSubmitting,
      error,
    } = this.props;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <img
            src="./assets/images/logo.svg"
            className="auth__logo"
            alt=""
          />
          <h1>{intl.formatMessage(messages.headline)}</h1>
          <Infobox type="warning">
            {intl.formatMessage(messages.info)}
          </Infobox>
          <Input
            field={form.$('password')}
            showPasswordToggle
          />
          {error.code === 'invalid-credentials' && (
            <p className="error-message center">{intl.formatMessage(messages.invalidCredentials)}</p>
          )}
          {isSubmitting ? (
            <Button
              className="auth__button is-loading"
              buttonType="secondary"
              label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
              loaded={false}
              disabled
            />
          ) : (
            <Button
              type="submit"
              className="auth__button"
              label={intl.formatMessage(messages.submitButtonLabel)}
            />
          )}
        </form>
      </div>
    );
  }
}
