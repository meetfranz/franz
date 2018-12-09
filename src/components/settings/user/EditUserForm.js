import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';

// import { Link } from 'react-router';

import Form from '../../../lib/Form';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Radio from '../../ui/Radio';
import Infobox from '../../ui/Infobox';

const messages = defineMessages({
  headline: {
    id: 'settings.account.headline',
    defaultMessage: '!!!Account',
  },
  headlineProfile: {
    id: 'settings.account.headlineProfile',
    defaultMessage: '!!!Update Profile',
  },
  headlineAccount: {
    id: 'settings.account.headlineAccount',
    defaultMessage: '!!!Account Information',
  },
  headlinePassword: {
    id: 'settings.account.headlinePassword',
    defaultMessage: '!!!Change Password',
  },
  successInfo: {
    id: 'settings.account.successInfo',
    defaultMessage: '!!!Your changes have been saved',
  },
  buttonSave: {
    id: 'settings.account.buttonSave',
    defaultMessage: '!!!Update profile',
  },
});

export default @observer class EditServiceForm extends Component {
  static propTypes = {
    status: MobxPropTypes.observableArray.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isEnterprise: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  submit(e) {
    e.preventDefault();
    this.props.form.submit({
      onSuccess: (form) => {
        const values = form.values();
        this.props.onSubmit(values);
      },
      onError: () => {},
    });
  }

  render() {
    const {
      // user,
      status,
      form,
      isEnterprise,
      isSaving,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            <Link to="/settings/user">
              {intl.formatMessage(messages.headline)}
            </Link>
          </span>
          <span className="separator" />
          <span className="settings__header-item">
            {intl.formatMessage(messages.headlineProfile)}
          </span>
        </div>
        <div className="settings__body">
          <form onSubmit={e => this.submit(e)} id="form">
            {status.length > 0 && status.includes('data-updated') && (
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
              >
                {intl.formatMessage(messages.successInfo)}
              </Infobox>
            )}
            <h2>{intl.formatMessage(messages.headlineAccount)}</h2>
            <div className="grid__row">
              <Input field={form.$('firstname')} focus />
              <Input field={form.$('lastname')} />
            </div>
            <Input field={form.$('email')} />
            {!isEnterprise && (
              <Radio field={form.$('accountType')} />
            )}
            {!isEnterprise && form.$('accountType').value === 'company' && (
              <Input field={form.$('organization')} />
            )}
            <h2>{intl.formatMessage(messages.headlinePassword)}</h2>
            <Input
              field={form.$('oldPassword')}
              showPasswordToggle
            />
            <Input
              field={form.$('newPassword')}
              showPasswordToggle
              scorePassword
            />
          </form>
        </div>
        <div className="settings__controls">
          {/* Save Button */}
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
              htmlForm="form"
            />
          )}
        </div>
      </div>
    );
  }
}
