import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import AppStore from '../../stores/AppStore';
import SettingsStore from '../../stores/SettingsStore';
import UserStore from '../../stores/UserStore';
import Form from '../../lib/Form';
import languages from '../../i18n/languages';
import { gaPage } from '../../lib/analytics';


import EditSettingsForm from '../../components/settings/settings/EditSettingsForm';

const messages = defineMessages({
  autoLaunchOnStart: {
    id: 'settings.app.form.autoLaunchOnStart',
    defaultMessage: '!!!Launch Franz on start',
  },
  autoLaunchInBackground: {
    id: 'settings.app.form.autoLaunchInBackground',
    defaultMessage: '!!!Open in background',
  },
  runInBackground: {
    id: 'settings.app.form.runInBackground',
    defaultMessage: '!!!Keep Franz in background when closing the window',
  },
  minimizeToSystemTray: {
    id: 'settings.app.form.minimizeToSystemTray',
    defaultMessage: '!!!Minimize Franz to system tray',
  },
  language: {
    id: 'settings.app.form.language',
    defaultMessage: '!!!Language',
  },
  beta: {
    id: 'settings.app.form.beta',
    defaultMessage: '!!!Include beta versions',
  },
});

@inject('stores', 'actions') @observer
export default class EditSettingsScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    gaPage('Settings/App');
  }

  onSubmit(settingsData) {
    const { app, settings, user } = this.props.actions;

    app.launchOnStartup({
      enable: settingsData.autoLaunchOnStart,
      openInBackground: settingsData.autoLaunchInBackground,
    });

    settings.update({
      settings: {
        runInBackground: settingsData.runInBackground,
        minimizeToSystemTray: settingsData.minimizeToSystemTray,
        locale: settingsData.locale,
        beta: settingsData.beta,
      },
    });

    user.update({
      userData: {
        beta: settingsData.beta,
      },
    });
  }

  prepareForm() {
    const { app, settings, user } = this.props.stores;
    const { intl } = this.context;

    const options = [];
    Object.keys(languages).forEach((key) => {
      options.push({
        value: key,
        label: languages[key],
      });
    });

    const config = {
      fields: {
        autoLaunchOnStart: {
          label: intl.formatMessage(messages.autoLaunchOnStart),
          value: app.autoLaunchOnStart,
          default: true,
        },
        autoLaunchInBackground: {
          label: intl.formatMessage(messages.autoLaunchInBackground),
          value: app.launchInBackground,
          default: false,
        },
        runInBackground: {
          label: intl.formatMessage(messages.runInBackground),
          value: settings.all.runInBackground,
          default: true,
        },
        minimizeToSystemTray: {
          label: intl.formatMessage(messages.minimizeToSystemTray),
          value: settings.all.minimizeToSystemTray,
          default: false,
        },
        locale: {
          label: intl.formatMessage(messages.language),
          value: app.locale,
          options,
          default: 'en-US',
        },
        beta: {
          label: intl.formatMessage(messages.beta),
          value: user.data.beta,
          default: false,
        },
      },
    };

    return new Form(config);
  }

  render() {
    const { updateStatus, updateStatusTypes } = this.props.stores.app;
    const { checkForUpdates, installUpdate } = this.props.actions.app;
    const form = this.prepareForm();

    return (
      <EditSettingsForm
        form={form}
        checkForUpdates={checkForUpdates}
        installUpdate={installUpdate}
        isCheckingForUpdates={updateStatus === updateStatusTypes.CHECKING}
        isUpdateAvailable={updateStatus === updateStatusTypes.AVAILABLE}
        noUpdateAvailable={updateStatus === updateStatusTypes.NOT_AVAILABLE}
        updateIsReadyToInstall={updateStatus === updateStatusTypes.DOWNLOADED}
        onSubmit={d => this.onSubmit(d)}
      />
    );
  }
}

EditSettingsScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      launchOnStartup: PropTypes.func.isRequired,
      checkForUpdates: PropTypes.func.isRequired,
      installUpdate: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
