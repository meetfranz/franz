import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import AppStore from '../../stores/AppStore';
import SettingsStore from '../../stores/SettingsStore';
import UserStore from '../../stores/UserStore';
import TodosStore from '../../features/todos/store';
import Form from '../../lib/Form';
import { APP_LOCALES, SPELLCHECKER_LOCALES } from '../../i18n/languages';
import { DEFAULT_APP_SETTINGS } from '../../config';
import { config as spellcheckerConfig } from '../../features/spellchecker';

import { getSelectOptions } from '../../helpers/i18n-helpers';

import EditSettingsForm from '../../components/settings/settings/EditSettingsForm';
import ErrorBoundary from '../../components/util/ErrorBoundary';

import globalMessages from '../../i18n/globalMessages';
import { DEFAULT_IS_FEATURE_ENABLED_BY_USER } from '../../features/todos';
import WorkspacesStore from '../../features/workspaces/store';
import { DEFAULT_SETTING_KEEP_ALL_WORKSPACES_LOADED } from '../../features/workspaces';

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
  darkMode: {
    id: 'settings.app.form.darkMode',
    defaultMessage: '!!!Dark Mode',
  },
  showDisabledServices: {
    id: 'settings.app.form.showDisabledServices',
    defaultMessage: '!!!Display disabled services tabs',
  },
  showMessageBadgeWhenMuted: {
    id: 'settings.app.form.showMessagesBadgesWhenMuted',
    defaultMessage: '!!!Show unread message badge when notifications are disabled',
  },
  enableSpellchecking: {
    id: 'settings.app.form.enableSpellchecking',
    defaultMessage: '!!!Enable spell checking',
  },
  enableGPUAcceleration: {
    id: 'settings.app.form.enableGPUAcceleration',
    defaultMessage: '!!!Enable GPU Acceleration',
  },
  beta: {
    id: 'settings.app.form.beta',
    defaultMessage: '!!!Include beta versions',
  },
  enableTodos: {
    id: 'settings.app.form.enableTodos',
    defaultMessage: '!!!Enable Franz Todos',
  },
  keepAllWorkspacesLoaded: {
    id: 'settings.app.form.keepAllWorkspacesLoaded',
    defaultMessage: '!!!Keep all workspaces loaded',
  },
});

export default @inject('stores', 'actions') @observer class EditSettingsScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  onSubmit(settingsData) {
    const { todos, workspaces } = this.props.stores;
    const {
      app,
      settings,
      user,
      todos: todosActions,
      workspaces: workspaceActions,
    } = this.props.actions;

    app.launchOnStartup({
      enable: settingsData.autoLaunchOnStart,
      openInBackground: settingsData.autoLaunchInBackground,
    });

    settings.update({
      type: 'app',
      data: {
        runInBackground: settingsData.runInBackground,
        enableSystemTray: settingsData.enableSystemTray,
        minimizeToSystemTray: settingsData.minimizeToSystemTray,
        enableGPUAcceleration: settingsData.enableGPUAcceleration,
        showDisabledServices: settingsData.showDisabledServices,
        darkMode: settingsData.darkMode,
        showMessageBadgeWhenMuted: settingsData.showMessageBadgeWhenMuted,
        enableSpellchecking: settingsData.enableSpellchecking,
        spellcheckerLanguage: settingsData.spellcheckerLanguage,
        beta: settingsData.beta, // we need this info in the main process as well
        locale: settingsData.locale, // we need this info in the main process as well
      },
    });

    user.update({
      userData: {
        beta: settingsData.beta,
        locale: settingsData.locale,
      },
    });

    if (workspaces.isFeatureActive) {
      const { keepAllWorkspacesLoaded } = workspaces.settings;
      if (keepAllWorkspacesLoaded !== settingsData.keepAllWorkspacesLoaded) {
        workspaceActions.toggleKeepAllWorkspacesLoadedSetting();
      }
    }

    if (todos.isFeatureActive) {
      const { isFeatureEnabledByUser } = todos.settings;
      if (isFeatureEnabledByUser !== settingsData.enableTodos) {
        todosActions.toggleTodosFeatureVisibility();
      }
    }
  }

  prepareForm() {
    const {
      app, settings, user, todos, workspaces,
    } = this.props.stores;
    const { intl } = this.context;

    const locales = getSelectOptions({
      locales: APP_LOCALES,
    });

    const spellcheckingLanguages = getSelectOptions({
      locales: SPELLCHECKER_LOCALES,
      automaticDetectionText: this.context.intl.formatMessage(globalMessages.spellcheckerAutomaticDetection),
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
          value: settings.all.app.runInBackground,
          default: DEFAULT_APP_SETTINGS.runInBackground,
        },
        enableSystemTray: {
          label: intl.formatMessage(messages.enableSystemTray),
          value: settings.all.app.enableSystemTray,
          default: DEFAULT_APP_SETTINGS.enableSystemTray,
        },
        minimizeToSystemTray: {
          label: intl.formatMessage(messages.minimizeToSystemTray),
          value: settings.all.app.minimizeToSystemTray,
          default: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
        },
        showDisabledServices: {
          label: intl.formatMessage(messages.showDisabledServices),
          value: settings.all.app.showDisabledServices,
          default: DEFAULT_APP_SETTINGS.showDisabledServices,
        },
        showMessageBadgeWhenMuted: {
          label: intl.formatMessage(messages.showMessageBadgeWhenMuted),
          value: settings.all.app.showMessageBadgeWhenMuted,
          default: DEFAULT_APP_SETTINGS.showMessageBadgeWhenMuted,
        },
        enableSpellchecking: {
          label: intl.formatMessage(messages.enableSpellchecking),
          value: !this.props.stores.user.data.isPremium && !spellcheckerConfig.isIncludedInCurrentPlan ? false : settings.all.app.enableSpellchecking,
          default: !this.props.stores.user.data.isPremium && !spellcheckerConfig.isIncludedInCurrentPlan ? false : DEFAULT_APP_SETTINGS.enableSpellchecking,
        },
        spellcheckerLanguage: {
          label: intl.formatMessage(globalMessages.spellcheckerLanguage),
          value: settings.all.app.spellcheckerLanguage,
          options: spellcheckingLanguages,
          default: DEFAULT_APP_SETTINGS.spellcheckerLanguage,
        },
        darkMode: {
          label: intl.formatMessage(messages.darkMode),
          value: settings.all.app.darkMode,
          default: DEFAULT_APP_SETTINGS.darkMode,
        },
        enableGPUAcceleration: {
          label: intl.formatMessage(messages.enableGPUAcceleration),
          value: settings.all.app.enableGPUAcceleration,
          default: DEFAULT_APP_SETTINGS.enableGPUAcceleration,
        },
        locale: {
          label: intl.formatMessage(messages.language),
          value: app.locale,
          options: locales,
          default: DEFAULT_APP_SETTINGS.locale,
        },
        beta: {
          label: intl.formatMessage(messages.beta),
          value: user.data.beta,
          default: DEFAULT_APP_SETTINGS.beta,
        },
      },
    };

    if (workspaces.isFeatureActive) {
      config.fields.keepAllWorkspacesLoaded = {
        label: intl.formatMessage(messages.keepAllWorkspacesLoaded),
        value: workspaces.settings.keepAllWorkspacesLoaded,
        default: DEFAULT_SETTING_KEEP_ALL_WORKSPACES_LOADED,
      };
    }

    if (todos.isFeatureActive) {
      config.fields.enableTodos = {
        label: intl.formatMessage(messages.enableTodos),
        value: todos.settings.isFeatureEnabledByUser,
        default: DEFAULT_IS_FEATURE_ENABLED_BY_USER,
      };
    }

    return new Form(config);
  }

  render() {
    const {
      app,
      todos,
      workspaces,
    } = this.props.stores;
    const {
      updateStatus,
      cacheSize,
      updateStatusTypes,
      isClearingAllCache,
    } = app;
    const {
      checkForUpdates,
      installUpdate,
      clearAllCache,
    } = this.props.actions.app;
    const form = this.prepareForm();

    return (
      <ErrorBoundary>
        <EditSettingsForm
          form={form}
          checkForUpdates={checkForUpdates}
          installUpdate={installUpdate}
          isCheckingForUpdates={updateStatus === updateStatusTypes.CHECKING}
          isUpdateAvailable={updateStatus === updateStatusTypes.AVAILABLE}
          noUpdateAvailable={updateStatus === updateStatusTypes.NOT_AVAILABLE}
          updateIsReadyToInstall={updateStatus === updateStatusTypes.DOWNLOADED}
          onSubmit={d => this.onSubmit(d)}
          cacheSize={cacheSize}
          isClearingAllCache={isClearingAllCache}
          onClearAllCache={clearAllCache}
          isSpellcheckerIncludedInCurrentPlan={spellcheckerConfig.isIncludedInCurrentPlan}
          isTodosEnabled={todos.isFeatureActive}
          isWorkspaceEnabled={workspaces.isFeatureActive}
        />
      </ErrorBoundary>
    );
  }
}

EditSettingsScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    todos: PropTypes.instanceOf(TodosStore).isRequired,
    workspaces: PropTypes.instanceOf(WorkspacesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      launchOnStartup: PropTypes.func.isRequired,
      checkForUpdates: PropTypes.func.isRequired,
      installUpdate: PropTypes.func.isRequired,
      clearAllCache: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    todos: PropTypes.shape({
      toggleTodosFeatureVisibility: PropTypes.func.isRequired,
    }).isRequired,
    workspaces: PropTypes.shape({
      toggleKeepAllWorkspacesLoadedSetting: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
