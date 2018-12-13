import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { isDevMode, useLiveAPI } from '../../environment';
import Form from '../../lib/Form';
import { required, email } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from '../ui/Link';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'login.headline',
    defaultMessage: '!!!Sign in',
  },
  emailLabel: {
    id: 'login.email.label',
    defaultMessage: '!!!Email address',
  },
  passwordLabel: {
    id: 'login.password.label',
    defaultMessage: '!!!Password',
  },
  submitButtonLabel: {
    id: 'login.submit.label',
    defaultMessage: '!!!Sign in',
  },
  invalidCredentials: {
    id: 'login.invalidCredentials',
    defaultMessage: '!!!Email or password not valid',
  },
  tokenExpired: {
    id: 'login.tokenExpired',
    defaultMessage: '!!!Your session expired, please login again.',
  },
  serverLogout: {
    id: 'login.serverLogout',
    defaultMessage: '!!!Your session expired, please login again.',
  },
  signupLink: {
    id: 'login.link.signup',
    defaultMessage: '!!!Create a free account',
  },
  passwordLink: {
    id: 'login.link.password',
    defaultMessage: '!!!Forgot password',
  },
});

export default @observer class Login extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isTokenExpired: PropTypes.bool.isRequired,
    isServerLogout: PropTypes.bool.isRequired,
    signupRoute: PropTypes.string.isRequired,
    passwordRoute: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validators: [required, email],
      },
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validators: [required],
        type: 'password',
      },
    },
  }, this.context.intl);

  emailField = null;

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
      isTokenExpired,
      isServerLogout,
      signupRoute,
      passwordRoute,
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
          {isDevMode && !useLiveAPI && (
            <Infobox type="warning">
              In Dev Mode your data is not persistent. Please use the live app for accesing the production API.
            </Infobox>
          )}
          {isTokenExpired && (
            <p className="error-message center">{intl.formatMessage(messages.tokenExpired)}</p>
          )}
          {isServerLogout && (
            <p className="error-message center">{intl.formatMessage(messages.serverLogout)}</p>
          )}
          <Input
            field={form.$('email')}
            ref={(element) => { this.emailField = element; }}
            focus
          />
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
        <div className="auth__links">
          <Link to={signupRoute}>{intl.formatMessage(messages.signupLink)}</Link>
          <Link to={passwordRoute}>{intl.formatMessage(messages.passwordLink)}</Link>
        </div>
      </div>
    );
  }
}
