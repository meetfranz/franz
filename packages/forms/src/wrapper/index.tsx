import { observer } from 'mobx-react';
import React, { Component } from 'react';
import injectStyle from 'react-jss';
import { IWithStyle } from '../typings/generic';

import styles from './styles';

interface IProps extends IWithStyle {
  children: React.ReactNode;
}

@observer
class Wrapper extends Component<IProps> {
  render() {
    const {
      children,
      classes,
    } = this.props;

    return (
      <div className={classes.container}>
        {children}
      </div>
    );
  }
}

export default injectStyle(styles)(Wrapper);
