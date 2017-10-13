import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';

import Form from '../../lib/Form';
import { email } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'invite.headline.friends',
    defaultMessage: '!!!Invite 3 of your friends or colleagues',
  },
  nameLabel: {
    id: 'invite.name.label',
    defaultMessage: '!!!Name',
  },
  emailLabel: {
    id: 'invite.email.label',
    defaultMessage: '!!!Email address',
  },
  submitButtonLabel: {
    id: 'invite.submit.label',
    defaultMessage: '!!!Send invites',
  },
  skipButtonLabel: {
    id: 'invite.skip.label',
    defaultMessage: '!!!I want to do this later',
  },
});

@observer
export default class Invite extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      invite: [...Array(3).fill({
        name: {
          label: this.context.intl.formatMessage(messages.nameLabel),
          // value: '',
          placeholder: this.context.intl.formatMessage(messages.nameLabel),
        },
        email: {
          label: this.context.intl.formatMessage(messages.emailLabel),
          // value: '',
          validate: [email],
          placeholder: this.context.intl.formatMessage(messages.emailLabel),
        },
      })],
    },
  }, this.context.intl);

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit({ invites: form.values().invite });
      },
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;

    return (
      <div className="auth__container auth__container--signup">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <img
            src="./assets/images/logo.svg"
            className="auth__logo"
            alt=""
          />
          <h1>
            {intl.formatMessage(messages.headline)}
          </h1>
          {form.$('invite').map(invite => (
            <div className="grid" key={invite.key}>
              <div className="grid__row">
                <Input field={invite.$('name')} showLabel={false} />
                <Input field={invite.$('email')} showLabel={false} />
              </div>
            </div>
          ))}
          <Button
            type="submit"
            className="auth__button"
            label={intl.formatMessage(messages.submitButtonLabel)}
          />
          <Link
            to="/"
            className="franz-form__button franz-form__button--secondary auth__button auth__button--skip"
          >
            {intl.formatMessage(messages.skipButtonLabel)}
          </Link>
        </form>
      </div>
    );
  }
}
