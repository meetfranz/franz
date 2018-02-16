import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import Select from '../../ui/Select';
import Appear from '../../ui/effects/Appear';

import { FRANZ_TRANSLATION } from '../../../config';

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
  headlineAdvanced: {
    id: 'settings.app.headlineAdvanced',
    defaultMessage: '!!!Advanced',
  },
  translationHelp: {
    id: 'settings.app.translationHelp',
    defaultMessage: '!!!Help us to translate Franz into your language.',
  },
  subheadlineCache: {
    id: 'settings.app.subheadlineCache',
    defaultMessage: '!!!Cache',
  },
  cacheInfo: {
    id: 'settings.app.cacheInfo',
    defaultMessage: '!!!Franz cache is currently using {size} of disk space.',
  },
  buttonClearAllCache: {
    id: 'settings.app.buttonClearAllCache',
    defaultMessage: '!!!Clear cache',
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
    isClearingAllCache: PropTypes.bool.isRequired,
    onClearAllCache: PropTypes.func.isRequired,
    cacheSize: PropTypes.string.isRequired,
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
      isClearingAllCache,
      onClearAllCache,
      cacheSize,
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
            {/* General */}
            <h2 id="general">{intl.formatMessage(messages.headlineGeneral)}</h2>
            <Toggle field={form.$('autoLaunchOnStart')} />
            <Toggle field={form.$('runInBackground')} />
            <Toggle field={form.$('enableSystemTray')} />
            {process.platform === 'darwin' && form.$('enableSystemTray').value && (
              <Appear>
                <div className="settings__toggle--nested">
                  <Toggle field={form.$('hideDockIcon')} />
                </div>
              </Appear>
            )}
            {process.platform === 'win32' && (
              <Toggle field={form.$('minimizeToSystemTray')} />
            )}

            {/* Appearance */}
            <h2 id="apperance">{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <Toggle field={form.$('showMessageBadgeWhenMuted')} />

            {/* Language */}
            <h2 id="language">{intl.formatMessage(messages.headlineLanguage)}</h2>
            <Select field={form.$('locale')} showLabel={false} />
            <a
              href={FRANZ_TRANSLATION}
              target="_blank"
              className="link"
            >
              {intl.formatMessage(messages.translationHelp)} <i className="mdi mdi-open-in-new" />
            </a>

            {/* Advanced */}
            <h2 id="advanced">{intl.formatMessage(messages.headlineAdvanced)}</h2>
            <Toggle field={form.$('enableSpellchecking')} />
            {/* <Select field={form.$('spellcheckingLanguage')} /> */}
            <div className="settings__settings-group">
              <h3>
                {intl.formatMessage(messages.subheadlineCache)}
              </h3>
              <p>
                {intl.formatMessage(messages.cacheInfo, {
                  size: cacheSize,
                })}
              </p>
              <p>
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.buttonClearAllCache)}
                  onClick={onClearAllCache}
                  disabled={isClearingAllCache}
                  loaded={!isClearingAllCache}
                />
              </p>
            </div>

            {/* Updates */}
            <h2 id="updates">{intl.formatMessage(messages.headlineUpdates)}</h2>
            {updateIsReadyToInstall ? (
              <Button
                label={intl.formatMessage(messages.buttonInstallUpdate)}
                onClick={installUpdate}
              />
            ) : (
              <Button
                buttonType="secondary"
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
