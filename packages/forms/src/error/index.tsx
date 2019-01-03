import classnames from 'classnames';
import { Classes } from 'jss';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import injectSheet from 'react-jss';

import styles from './styles';

interface IProps {
  classes: Classes;
  message: string;
}

@observer
class Error extends Component<IProps> {
  render() {
    const {
      classes,
      message,
    } = this.props;

    return (
      <p
        className={classes.message}
      >
        {message}
      </p>
    );
  }
}

export default injectSheet(styles)(Error);
