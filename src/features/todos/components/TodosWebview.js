import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import Webview from 'react-electron-web-view';

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    height: '100%',
    width: 300,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  webview: {
    height: '100%',
  },
});

@injectSheet(styles) @observer
class TodosWebview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authToken: PropTypes.string.isRequired,
  };

  render() {
    const { authToken, classes } = this.props;
    return (
      <div className={classes.root}>
        <Webview
          className={classes.webview}
          src={`http://localhost:4000?authToken=${authToken}`}
        />
      </div>
    );
  }
}

export default TodosWebview;
