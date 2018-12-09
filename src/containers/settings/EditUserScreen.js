import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import UserStore from '../../stores/UserStore';
import Form from '../../lib/Form';
import EditUserForm from '../../components/settings/user/EditUserForm';
import ErrorBoundary from '../../components/util/ErrorBoundary';

import { required, email, minLength } from '../../helpers/validation-helpers';
import { gaPage } from '../../lib/analytics';

const messages = defineMessages({
  firstname: {
    id: 'settings.user.form.firstname',
    defaultMessage: '!!!Firstname',
  },
  lastname: {
    id: 'settings.user.form.lastname',
    defaultMessage: '!!!Lastname',
  },
  email: {
    id: 'settings.user.form.email',
    defaultMessage: '!!!Email',
  },
  accountType: {
    label: {
      id: 'settings.user.form.accountType.label',
      defaultMessage: '!!!Account type',
    },
    individual: {
      id: 'settings.user.form.accountType.individual',
      defaultMessage: '!!!Individual',
    },
    nonProfit: {
      id: 'settings.user.form.accountType.non-profit',
      defaultMessage: '!!!Non-Profit',
    },
    company: {
      id: 'settings.user.form.accountType.company',
      defaultMessage: '!!!Company',
    },
  },
  currentPassword: {
    id: 'settings.user.form.currentPassword',
    defaultMessage: '!!!Current password',
  },
  newPassword: {
    id: 'settings.user.form.newPassword',
    defaultMessage: '!!!New password',
  },
});

export default @inject('stores', 'actions') @observer class EditUserScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    gaPage('Settings/Account/Edit');
  }

  componentWillUnmount() {
    this.props.actions.user.resetStatus();
  }

  onSubmit(userData) {
    const { update } = this.props.actions.user;

    update({ userData });

    document.querySelector('#form').scrollIntoView({ behavior: 'smooth' });
  }

  prepareForm(user) {
    const { intl } = this.context;

    const config = {
      fields: {
        firstname: {
          label: intl.formatMessage(messages.firstname),
          placeholder: intl.formatMessage(messages.firstname),
          value: user.firstname,
          validators: [required],
        },
        lastname: {
          label: intl.formatMessage(messages.lastname),
          placeholder: intl.formatMessage(messages.lastname),
          value: user.lastname,
          validators: [required],
        },
        email: {
          label: intl.formatMessage(messages.email),
          placeholder: intl.formatMessage(messages.email),
          value: user.email,
          validators: [required, email],
        },
        accountType: {
          value: user.accountType,
          validators: [required],
          label: intl.formatMessage(messages.accountType.label),
          options: [{
            value: 'individual',
            label: intl.formatMessage(messages.accountType.individual),
          }, {
            value: 'non-profit',
            label: intl.formatMessage(messages.accountType.nonProfit),
          }, {
            value: 'company',
            label: intl.formatMessage(messages.accountType.company),
          }],
        },
        organization: {
          label: intl.formatMessage(messages.accountType.company),
          placeholder: intl.formatMessage(messages.accountType.company),
          value: user.organization,
        },
        oldPassword: {
          label: intl.formatMessage(messages.currentPassword),
          type: 'password',
          validators: [minLength(6)],
        },
        newPassword: {
          label: intl.formatMessage(messages.newPassword),
          type: 'password',
          validators: [minLength(6)],
        },
      },
    };

    return new Form(config);
  }

  render() {
    const { user } = this.props.stores;

    if (user.getUserInfoRequest.isExecuting) {
      return (<div>Loading...</div>);
    }

    const form = this.prepareForm(user.data);

    return (
      <ErrorBoundary>
        <EditUserForm
          // user={user.data}
          status={user.actionStatus}
          form={form}
          isSaving={user.updateUserInfoRequest.isExecuting}
          onSubmit={d => this.onSubmit(d)}
        />
      </ErrorBoundary>
    );
  }
}

EditUserScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
      resetStatus: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
