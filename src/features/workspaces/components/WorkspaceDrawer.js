import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { H1, Icon } from '@meetfranz/ui';
import { workspacesState } from '../state';
import WorkspaceDrawerItem from './WorkspaceDrawerItem';
import { workspaceActions } from '../actions';

const messages = defineMessages({
  headline: {
    id: 'workspaceDrawer.headline',
    defaultMessage: '!!!Workspaces',
  },
  allServices: {
    id: 'workspaceDrawer.allServices',
    defaultMessage: '!!!All services',
  },
});

const styles = theme => ({
  drawer: {
    backgroundColor: theme.workspaceDrawerBackground,
    width: `${theme.workspaceDrawerWidth}px`,
  },
  headline: {
    fontSize: '24px',
    marginTop: '38px',
    marginBottom: '25px',
    marginLeft: `${theme.workspaceDrawerPadding}px`,
  },
  addWorkspaceButton: {
    float: 'right',
    marginRight: `${theme.workspaceDrawerPadding}px`,
    marginTop: '2px',
  },
  addWorkspaceButtonIcon: {
    fill: theme.workspaceDrawerAddButtonColor,
    '&:hover': {
      fill: theme.workspaceDrawerAddButtonHoverColor,
    },
  },
});

@injectSheet(styles) @observer
class WorkspaceDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getServicesForWorkspace: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      getServicesForWorkspace,
    } = this.props;
    const { intl } = this.context;
    const { activeWorkspace, isSwitchingWorkspace, nextWorkspace } = workspacesState;
    const actualWorkspace = isSwitchingWorkspace ? nextWorkspace : activeWorkspace;
    return (
      <div className={classes.drawer}>
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.headline)}
          <span
            className={classes.addWorkspaceButton}
            onClick={workspaceActions.openWorkspaceSettings}
          >
            <Icon
              icon="mdiPlusBox"
              size={1.5}
              className={classes.addWorkspaceButtonIcon}
            />
          </span>
        </H1>
        <div className={classes.workspaces}>
          <WorkspaceDrawerItem
            name={intl.formatMessage(messages.allServices)}
            onClick={() => workspaceActions.deactivate()}
            services={getServicesForWorkspace(null)}
            isActive={actualWorkspace == null}
          />
          {workspacesState.workspaces.map(workspace => (
            <WorkspaceDrawerItem
              key={workspace.id}
              name={workspace.name}
              isActive={actualWorkspace === workspace}
              onClick={() => workspaceActions.activate({ workspace })}
              services={getServicesForWorkspace(workspace)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default WorkspaceDrawer;
