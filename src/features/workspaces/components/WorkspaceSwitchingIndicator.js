import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { workspacesState } from '../state';
import LoaderComponent from '../../../components/ui/Loader';

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'absolute',
    width: '100%',
    marginTop: '20px',
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

  render() {
    const { classes } = this.props;
    const { isSwitchingWorkspace, nextWorkspace } = workspacesState;
    if (!isSwitchingWorkspace) return null;
    const nextWorkspaceName = nextWorkspace ? nextWorkspace.name : 'All services';
    return (
      <div className={classes.wrapper}>
        <div className={classes.component}>
          <h1 className={classes.name}>
            {`Switching to ${nextWorkspaceName}`}
          </h1>
          <LoaderComponent />
        </div>
      </div>
    );
  }
}

export default WorkspaceSwitchingIndicator;
