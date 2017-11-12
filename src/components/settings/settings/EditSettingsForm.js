import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import Select from '../../ui/Select';

const messages = defineMessages({
  headline: {
    id: 'settings.app.headline',
    defaultMessage: '!!!Settings',
  },
  headlineGeneral: {
    id: 'settings.app.headlineGeneral',
    defaultMessage: '!!!General',
  },
  headlineLanguage: {
    id: 'settings.app.headlineLanguage',
    defaultMessage: '!!!Language',
  },
  headlineUpdates: {
    id: 'settings.app.headlineUpdates',
    defaultMessage: '!!!Updates',
  },
  headlineAppearance: {
    id: 'settings.app.headlineAppearance',
    defaultMessage: '!!!Appearance',
  },
  headlineMessaging: {
    id: 'settings.app.headlineMessaging',
    defaultMessage: '!!!Messaging',
  },
  buttonSearchForUpdate: {
    id: 'settings.app.buttonSearchForUpdate',
    defaultMessage: '!!!Check for updates',
  },
  buttonInstallUpdate: {
    id: 'settings.app.buttonInstallUpdate',
    defaultMessage: '!!!Restart & install update',
  },
  updateStatusSearching: {
    id: 'settings.app.updateStatusSearching',
    defaultMessage: '!!!Is searching for update',
  },
  updateStatusAvailable: {
    id: 'settings.app.updateStatusAvailable',
    defaultMessage: '!!!Update available, downloading...',
  },
  updateStatusUpToDate: {
    id: 'settings.app.updateStatusUpToDate',
    defaultMessage: '!!!You are using the latest version of Franz',
  },
  currentVersion: {
    id: 'settings.app.currentVersion',
    defaultMessage: '!!!Current version:',
  },
});

@observer
export default class EditSettingsForm extends Component {
  static propTypes = {
    checkForUpdates: PropTypes.func.isRequired,
    installUpdate: PropTypes.func.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isCheckingForUpdates: PropTypes.bool.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    noUpdateAvailable: PropTypes.bool.isRequired,
    updateIsReadyToInstall: PropTypes.bool.isRequired,
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
      checkForUpdates,
      installUpdate,
      form,
      isCheckingForUpdates,
      isUpdateAvailable,
      noUpdateAvailable,
      updateIsReadyToInstall,
    } = this.props;
    const { intl } = this.context;

    let updateButtonLabelMessage = messages.buttonSearchForUpdate;
    if (isCheckingForUpdates) {
      updateButtonLabelMessage = messages.updateStatusSearching;
    } else if (isUpdateAvailable) {
      updateButtonLabelMessage = messages.updateStatusAvailable;
    } else {
      updateButtonLabelMessage = messages.buttonSearchForUpdate;
    }

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          <form
            onSubmit={e => this.submit(e)}
            onChange={e => this.submit(e)}
            id="form"
          >
            <h2>{intl.formatMessage(messages.headlineGeneral)}</h2>
            <Toggle field={form.$('autoLaunchOnStart')} />
            <Toggle field={form.$('runInBackground')} />
            <Toggle field={form.$('enableSystemTray')} />
            {process.platform === 'win32' && (
              <Toggle field={form.$('minimizeToSystemTray')} />
            )}
            <h2>{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <h2>{intl.formatMessage(messages.headlineMessaging)}</h2>
            <Toggle field={form.$('enableSpellchecking')} />
            <h2>{intl.formatMessage(messages.headlineLanguage)}</h2>
            <Select field={form.$('locale')} showLabel={false} />
            <h2>{intl.formatMessage(messages.headlineUpdates)}</h2>
            {updateIsReadyToInstall ? (
              <Button
                label={intl.formatMessage(messages.buttonInstallUpdate)}
                onClick={installUpdate}
              />
            ) : (
              <Button
                label={intl.formatMessage(updateButtonLabelMessage)}
                onClick={checkForUpdates}
                disabled={isCheckingForUpdates || isUpdateAvailable}
                loaded={!isCheckingForUpdates || !isUpdateAvailable}
              />
            )}
            {noUpdateAvailable && (
              <p>{intl.formatMessage(messages.updateStatusUpToDate)}</p>
            )}
            <br />
            <Toggle field={form.$('beta')} />
            {intl.formatMessage(messages.currentVersion)} {remote.app.getVersion()}
          </form>
        </div>
      </div>
    );
  }
}
