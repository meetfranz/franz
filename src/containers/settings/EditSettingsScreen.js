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
import { DEFAULT_APP_SETTINGS } from '../../config';


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
  enableSystemTray: {
    id: 'settings.app.form.enableSystemTray',
    defaultMessage: '!!!Show Franz in system tray',
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
        enableSystemTray: settingsData.enableSystemTray,
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
          default: DEFAULT_APP_SETTINGS.autoLaunchOnStart,
        },
        autoLaunchInBackground: {
          label: intl.formatMessage(messages.autoLaunchInBackground),
          value: app.launchInBackground,
          default: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
        },
        runInBackground: {
          label: intl.formatMessage(messages.runInBackground),
          value: settings.all.runInBackground,
          default: DEFAULT_APP_SETTINGS.runInBackground,
        },
        enableSystemTray: {
          label: intl.formatMessage(messages.enableSystemTray),
          value: settings.all.enableSystemTray,
          default: DEFAULT_APP_SETTINGS.enableSystemTray,
        },
        minimizeToSystemTray: {
          label: intl.formatMessage(messages.minimizeToSystemTray),
          value: settings.all.minimizeToSystemTray,
          default: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
        },
        locale: {
          label: intl.formatMessage(messages.language),
          value: app.locale,
          options,
          default: DEFAULT_APP_SETTINGS.locale,
        },
        beta: {
          label: intl.formatMessage(messages.beta),
          value: user.data.beta,
          default: DEFAULT_APP_SETTINGS.beta,
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
