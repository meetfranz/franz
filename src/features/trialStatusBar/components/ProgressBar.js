import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';

const styles = theme => ({
  root: {
    background: theme.trialStatusBar.progressBar.background,
    width: '25%',
    maxWidth: 200,
    height: 8,
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
  },
  progress: {
    background: theme.trialStatusBar.progressBar.progressIndicator,
    width: ({ percent }) => `${percent}%`,
    height: '100%',
  },
});

@injectSheet(styles) @observer
class ProgressBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div
        className={classes.root}
      >
        <div className={classes.progress} />
      </div>
    );
  }
}

export default ProgressBar;
