import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import injectCSS from 'react-jss';

import styles from './styles';

export default @injectCSS(styles) class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    portal: PropTypes.string,
    close: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: null,
    portal: 'modal-portal',
  }

  render() {
    const {
      children,
      className,
      classes,
      isOpen,
      portal,
      close,
    } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        className={classnames({
          [`${classes.modal}`]: true,
          [`${className}`]: className,
        })}
        portalClassName={classes.component}
        overlayClassName={classes.overlay}
        portal={portal}
        onRequestClose={close}
      >
        {/* <button
          type="button"
          className={classnames({
            [`${classes.close}`]: true,
            'mdi mdi-close': true,
          })}
        /> */}
        <div className={classes.content}>
          {children}
        </div>
      </ReactModal>
    );
  }
}
