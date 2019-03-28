import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';

import LoaderComponent from '../../../components/ui/Loader';
import { workspaceStore } from '../index';

const messages = defineMessages({
  switchingTo: {
    id: 'workspaces.switchingIndicator.switchingTo',
    defaultMessage: '!!!Switching to',
  },
});

const styles = theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'absolute',
    transition: 'width 0.5s ease',
    width: '100%',
    marginTop: '20px',
  },
  wrapperWhenDrawerIsOpen: {
    width: `calc(100% - ${theme.workspaceDrawerWidth}px)`,
  },
  component: {
    background: 'rgba(20, 20, 20, 0.4)',
    padding: '10px 20px',
    display: 'flex',
    width: 'auto',
    height: 'auto',
    margin: [0, 'auto'],
    borderRadius: 6,
    alignItems: 'center',
    zIndex: 200,
  },
  spinner: {
    width: '40px',
    marginRight: '5px',
  },
  message: {
    fontSize: 16,
    whiteSpace: 'nowrap',
  },
});

@injectSheet(styles) @observer
class WorkspaceSwitchingIndicator extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes } = this.props;
    const { intl } = this.context;
    const { isSwitchingWorkspace, isWorkspaceDrawerOpen, nextWorkspace } = workspaceStore;
    if (!isSwitchingWorkspace) return null;
    const nextWorkspaceName = nextWorkspace ? nextWorkspace.name : 'All services';
    return (
      <div
        className={classnames([
          classes.wrapper,
          isWorkspaceDrawerOpen ? classes.wrapperWhenDrawerIsOpen : null,
        ])}
      >
        <div className={classes.component}>
          <div className={classes.spinner}>
            <LoaderComponent />
          </div>
          <p className={classes.message}>
            {`${intl.formatMessage(messages.switchingTo)} ${nextWorkspaceName}`}
          </p>
        </div>
      </div>
    );
  }
}

export default WorkspaceSwitchingIndicator;
