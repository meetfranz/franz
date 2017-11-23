import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

import { oneOrManyChildElements } from '../../prop-types';

export default class LoaderComponent extends Component {
  static propTypes = {
    children: oneOrManyChildElements,
    loaded: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    loaded: false,
    className: '',
    color: '#373a3c',
  };

  render() {
    const {
      children,
      loaded,
      className,
      color,
    } = this.props;

    return (
      <Loader
        loaded={loaded}
        // lines={10}
        width={4}
        scale={0.6}
        color={color}
        component="span"
        className={className}
      >
        {children}
      </Loader>
    );
  }
}
