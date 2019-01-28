import classnames from 'classnames';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import injectStyle from 'react-jss';
import { IWithStyle } from '../typings/generic';

import styles from './styles';

interface IProps extends IWithStyle {
  children: React.ReactNode;
  className?: string;
}

@observer
class WrapperComponent extends Component<IProps> {
  render() {
    const {
      children,
      classes,
      className,
    } = this.props;

    return (
      <div className={classnames({
        [`${classes.container}`]: true,
        [`${className}`]: className,
      })}>
        {children}
      </div>
    );
  }
}

export const Wrapper = injectStyle(styles)(WrapperComponent);
