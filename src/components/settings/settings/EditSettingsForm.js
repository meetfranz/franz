import { remote } from 'electron';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { defineMessages, intlShape } from 'react-intl';

import { DEFAULT_APP_SETTINGS, FRANZ_TRANSLATION } from '../../../config';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';
import Select from '../../ui/Select';
import Toggle from '../../ui/Toggle';

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
  theme: {
    id: 'settings.app.headlineAppTheme',
    defaultMessage: '!!!Pick Franz theme',
  },
  appBackground: {
    id: 'settings.app.headlineBackground',
    defaultMessage: '!!!Add app background',
  },
  setBackground: {
    id: 'settings.app.setBackground',
    defaultMessage: '!!!Set background',
  },
  resetBackground: {
    id: 'settings.app.resetBackground',
    defaultMessage: '!!!Reset background',
  },
});

export default @observer class EditSettingsForm extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      setBackground: PropTypes.func.isRequired,
      resetBackground: PropTypes.func.isRequired,
    }).isRequired,
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
    isSpellcheckerPremiumFeature: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  compareCurrentBg(newBg) {
    if (!newBg) {
      return false;
    }

    return newBg === DEFAULT_APP_SETTINGS.appBackground;
  }

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
      actions,
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
      isSpellcheckerPremiumFeature,
    } = this.props;
    const { intl } = this.context;
    const { setBackground, resetBackground } = actions;

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

            {/* Appearance */}
            <h2 id="apperance">{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <Toggle field={form.$('showMessageBadgeWhenMuted')} />
            <Toggle field={form.$('darkMode')} />

            {/* Theme */}
            <h2 id="theme">{intl.formatMessage(messages.theme)}</h2>
            <Select field={form.$('theme')} showLabel={false} />

            {/* Backgrounds */}
            <h2 id="theme">{intl.formatMessage(messages.appBackground)}</h2>
            <div className="add-bg-row">
              <Input field={form.$('appBackground')} showLabel={false} />
            </div>
            <div className="add-bg-row">
              <Button
                buttonType="success"
                label={intl.formatMessage(messages.setBackground)}
                onClick={() => setBackground(form.values().appBackground)}
                disabled={!form.values().appBackground}
              />
              <Button
                buttonType="danger"
                label={intl.formatMessage(messages.resetBackground)}
                onClick={() => resetBackground(form.values().appBackground)}
                disabled={this.compareCurrentBg(form.values().appBackground)}
              />
            </div>

            {/* Language */}
            <h2 id="language">{intl.formatMessage(messages.headlineLanguage)}</h2>
            <Select field={form.$('locale')} showLabel={false} />
            <PremiumFeatureContainer
              condition={isSpellcheckerPremiumFeature}
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
          </form>
        </div>
      </div>
    );
  }
}
