import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { isDevMode, useLiveAPI } from '../../environment';
import Form from '../../lib/Form';
import { required, email, minLength } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from '../ui/Link';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'signup.headline',
    defaultMessage: '!!!Sign up',
  },
  firstnameLabel: {
    id: 'signup.firstname.label',
    defaultMessage: '!!!Firstname',
  },
  lastnameLabel: {
    id: 'signup.lastname.label',
    defaultMessage: '!!!Lastname',
  },
  emailLabel: {
    id: 'signup.email.label',
    defaultMessage: '!!!Email address',
  },
  // companyLabel: {
  //   id: 'signup.company.label',
  //   defaultMessage: '!!!Company',
  // },
  passwordLabel: {
    id: 'signup.password.label',
    defaultMessage: '!!!Password',
  },
  legalInfo: {
    id: 'signup.legal.info',
    defaultMessage: '!!!By creating a Franz account you accept the',
  },
  terms: {
    id: 'signup.legal.terms',
    defaultMessage: '!!!Terms of service',
  },
  privacy: {
    id: 'signup.legal.privacy',
    defaultMessage: '!!!Privacy Statement',
  },
  submitButtonLabel: {
    id: 'signup.submit.label',
    defaultMessage: '!!!Create account',
  },
  loginLink: {
    id: 'signup.link.login',
    defaultMessage: '!!!Already have an account, sign in?',
  },
  emailDuplicate: {
    id: 'signup.emailDuplicate',
    defaultMessage: '!!!A user with that email address already exists',
  },
});

export default @observer class Signup extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    loginRoute: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      firstname: {
        label: this.context.intl.formatMessage(messages.firstnameLabel),
        value: '',
        validators: [required],
      },
      lastname: {
        label: this.context.intl.formatMessage(messages.lastnameLabel),
        value: '',
        validators: [required],
      },
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validators: [required, email],
      },
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validators: [required, minLength(6)],
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
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const { isSubmitting, loginRoute, error } = this.props;

    return (
      <div className="auth__scroll-container">
        <div className="auth__container auth__container--signup">
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
            <div className="grid__row">
              <Input field={form.$('firstname')} focus />
              <Input field={form.$('lastname')} />
            </div>
            <Input field={form.$('email')} />
            <Input
              field={form.$('password')}
              showPasswordToggle
              scorePassword
            />
            {error.code === 'email-duplicate' && (
              <p className="error-message center">{intl.formatMessage(messages.emailDuplicate)}</p>
            )}
            {isSubmitting ? (
              <Button
                className="auth__button is-loading"
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
            <p className="legal">
              {intl.formatMessage(messages.legalInfo)}
              <br />
              <Link
                to="https://meetfranz.com/terms"
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.terms)}
              </Link>
              &nbsp;&amp;&nbsp;
              <Link
                to="https://meetfranz.com/privacy"
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.privacy)}
              </Link>
              .
            </p>
          </form>
          <div className="auth__links">
            <Link to={loginRoute}>{intl.formatMessage(messages.loginLink)}</Link>
          </div>
        </div>
      </div>
    );
  }
}
