import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { defineMessages, intlShape } from 'react-intl';
import { observer } from 'mobx-react';

import Tabbar from '../services/tabs/Tabbar';
import { ctrlKey } from '../../environment';
import { GA_CATEGORY_WORKSPACES, workspaceStore } from '../../features/workspaces';
import { gaEvent } from '../../lib/analytics';
import { todosStore, GA_CATEGORY_TODOS } from '../../features/todos';
import { todoActions } from '../../features/todos/actions';

const messages = defineMessages({
  settings: {
    id: 'sidebar.settings',
    defaultMessage: '!!!Settings',
  },
  addNewService: {
    id: 'sidebar.addNewService',
    defaultMessage: '!!!Add new service',
  },
  mute: {
    id: 'sidebar.muteApp',
    defaultMessage: '!!!Disable notifications & audio',
  },
  unmute: {
    id: 'sidebar.unmuteApp',
    defaultMessage: '!!!Enable notifications & audio',
  },
  openWorkspaceDrawer: {
    id: 'sidebar.openWorkspaceDrawer',
    defaultMessage: '!!!Open workspace drawer',
  },
  closeWorkspaceDrawer: {
    id: 'sidebar.closeWorkspaceDrawer',
    defaultMessage: '!!!Close workspace drawer',
  },
  openTodosDrawer: {
    id: 'sidebar.openTodosDrawer',
    defaultMessage: '!!!Open Franz Todos',
  },
  closeTodosDrawer: {
    id: 'sidebar.closeTodosDrawer',
    defaultMessage: '!!!Close Franz Todos',
  },
});

export default @observer class Sidebar extends Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    toggleMuteApp: PropTypes.func.isRequired,
    isAppMuted: PropTypes.bool.isRequired,
    isWorkspaceDrawerOpen: PropTypes.bool.isRequired,
    toggleWorkspaceDrawer: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    tooltipEnabled: true,
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  enableToolTip() {
    this.setState({ tooltipEnabled: true });
  }

  disableToolTip() {
    this.setState({ tooltipEnabled: false });
  }

  updateToolTip() {
    this.disableToolTip();
    setTimeout(this.enableToolTip.bind(this));
  }

  render() {
    const {
      openSettings,
      toggleMuteApp,
      isAppMuted,
      isWorkspaceDrawerOpen,
      toggleWorkspaceDrawer,
    } = this.props;
    const { intl } = this.context;
    const todosToggleMessage = (
      todosStore.isTodosPanelVisible ? messages.closeTodosDrawer : messages.openTodosDrawer
    );

    const workspaceToggleMessage = (
      isWorkspaceDrawerOpen ? messages.closeWorkspaceDrawer : messages.openWorkspaceDrawer
    );

    return (
      <div className="sidebar">
        <Tabbar
          {...this.props}
          enableToolTip={() => this.enableToolTip()}
          disableToolTip={() => this.disableToolTip()}
        />
        {todosStore.isFeatureEnabled && todosStore.isFeatureEnabledByUser ? (
          <button
            type="button"
            onClick={() => {
              todoActions.toggleTodosPanel();
              this.updateToolTip();
              gaEvent(GA_CATEGORY_TODOS, 'toggleDrawer', 'sidebar');
            }}
            className={`sidebar__button sidebar__button--todos  ${todosStore.isTodosPanelVisible ? 'is-active' : ''}`}
            data-tip={`${intl.formatMessage(todosToggleMessage)} (${ctrlKey}+T)`}
          >
            <i className="mdi mdi-check-all" />
          </button>
        ) : null}
        {workspaceStore.isFeatureEnabled ? (
          <button
            type="button"
            onClick={() => {
              toggleWorkspaceDrawer();
              this.updateToolTip();
              gaEvent(GA_CATEGORY_WORKSPACES, 'toggleDrawer', 'sidebar');
            }}
            className={`sidebar__button sidebar__button--workspaces ${isWorkspaceDrawerOpen ? 'is-active' : ''}`}
            data-tip={`${intl.formatMessage(workspaceToggleMessage)} (${ctrlKey}+D)`}
          >
            <i className="mdi mdi-view-grid" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            toggleMuteApp();
            this.updateToolTip();
          }}
          className={`sidebar__button sidebar__button--audio ${isAppMuted ? 'is-muted' : ''}`}
          data-tip={`${intl.formatMessage(isAppMuted ? messages.unmute : messages.mute)} (${ctrlKey}+Shift+M)`}
        >
          <i className={`mdi mdi-bell${isAppMuted ? '-off' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => openSettings({ path: 'recipes' })}
          className="sidebar__button sidebar__button--new-service"
          data-tip={`${intl.formatMessage(messages.addNewService)} (${ctrlKey}+N)`}
        >
          <i className="mdi mdi-plus-box" />
        </button>
        <button
          type="button"
          onClick={() => openSettings({ path: 'app' })}
          className="sidebar__button sidebar__button--settings"
          data-tip={`${intl.formatMessage(messages.settings)} (${ctrlKey}+,)`}
        >
          <i className="mdi mdi-settings" />
        </button>
        {this.state.tooltipEnabled && (
          <ReactTooltip place="right" type="dark" effect="solid" />
        )}
      </div>
    );
  }
}
