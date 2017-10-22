import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

@observer
export default class StatusBarTargetUrl extends Component {
  static propTypes = {
    // eslint-disable-next-line
    className: PropTypes.string,
    position: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    position: 'bottom',
    text: '',
  };

  render() {
    const {
      className,
      position,
      text,
    } = this.props;

    return (
      <div
        className={classnames({
          'status-bar-target-url': true,
          [`status-bar-target-url--${position}`]: true,
          [`${className}`]: true,
        })}
      >
        <div className="status-bar-target-url__content">
          {text}
        </div>
      </div>
    );
  }
}
