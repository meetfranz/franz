import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

import FullscreenLoader from '../FullscreenLoader';

import styles from './styles';

export default @injectSheet(styles) class WebviewLoader extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, name } = this.props;
    return (
      <FullscreenLoader
        className={classes.component}
        title={`Loading ${name}`}
      />
    );
  }
}
