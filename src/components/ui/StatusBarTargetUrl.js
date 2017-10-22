import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import Appear from '../ui/effects/Appear';

@observer
export default class StatusBarTargetUrl extends Component {
  static propTypes = {
    className: PropTypes.string,
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
      text,
    } = this.props;

    return (
      <Appear
        className={classnames({
          'status-bar-target-url': true,
          [`${className}`]: true,
        })}
      >
        <div className="status-bar-target-url__content">
          {text}
        </div>
      </Appear>
    );
  }
}
