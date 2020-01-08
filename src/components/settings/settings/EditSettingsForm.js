import { remote } from 'electron';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import Select from '../../ui/Select';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';

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
  enableGPUAccelerationInfo: {
    id: 'settings.app.restartRequired',
    defaultMessage: '!!!Changes require restart',
  },
  languageDisclaimer: {
    id: 'settings.app.languageDisclaimer',
    defaultMessage: '!!!Official translations are English & German. All other languages are community based translations.',
  },
});

export default @observer class EditSettingsForm extends Component {
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
    isSpellcheckerIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isTodosEnabled: PropTypes.bool.isRequired,
    isWorkspaceEnabled: PropTypes.bool.isRequired,
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
      isSpellcheckerIncludedInCurrentPlan,
      isTodosEnabled,
      isWorkspaceEnabled,
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
            {process.platform === 'win32' && (
              <Toggle field={form.$('minimizeToSystemTray')} />
            )}
            {isWorkspaceEnabled && (
              <Toggle field={form.$('keepAllWorkspacesLoaded')} />
            )}
            {isTodosEnabled && (
              <Toggle field={form.$('enableTodos')} />
            )}

            {/* Appearance */}
            <h2 id="apperance">{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <Toggle field={form.$('showMessageBadgeWhenMuted')} />
            <Toggle field={form.$('darkMode')} />

            {/* Language */}
            <h2 id="language">{intl.formatMessage(messages.headlineLanguage)}</h2>
            <Select field={form.$('locale')} showLabel={false} />
            <PremiumFeatureContainer
              condition={!isSpellcheckerIncludedInCurrentPlan}
              gaEventInfo={{ category: 'User', event: 'upgrade', label: 'spellchecker' }}
            >
              <Fragment>
                <Toggle
                  field={form.$('enableSpellchecking')}
                />
                {form.$('enableSpellchecking').value && (
                  <Select field={form.$('spellcheckerLanguage')} />
                )}
              </Fragment>
            </PremiumFeatureContainer>
            <a
              href={FRANZ_TRANSLATION}
              target="_blank"
              className="link"
            >
              {intl.formatMessage(messages.translationHelp)}
              {' '}
              <i className="mdi mdi-open-in-new" />
            </a>

            {/* Advanced */}
            <h2 id="advanced">{intl.formatMessage(messages.headlineAdvanced)}</h2>
            <Toggle field={form.$('enableGPUAcceleration')} />
            <p className="settings__help">{intl.formatMessage(messages.enableGPUAccelerationInfo)}</p>
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
            {intl.formatMessage(messages.currentVersion)}
            {' '}
            {remote.app.getVersion()}
            <p className="settings__message">
              <span className="mdi mdi-information" />
              {intl.formatMessage(messages.languageDisclaimer)}
            </p>
          </form>
        </div>
      </div>
    );
  }
}
