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
    padding: 20,
    width: 'auto',
    height: 'auto',
    margin: [0, 'auto'],
    borderRadius: 6,
    alignItems: 'flex-start',
    zIndex: 200,
  },
  name: {
    fontSize: 35,
    marginBottom: '10px',
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
          <h1 className={classes.name}>
            {`${intl.formatMessage(messages.switchingTo)} ${nextWorkspaceName}`}
          </h1>
          <LoaderComponent />
        </div>
      </div>
    );
  }
}

export default WorkspaceSwitchingIndicator;
