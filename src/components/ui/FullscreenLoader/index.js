import React from 'react';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import Loader from '../Loader';

import styles from './styles';

export default injectSheet(styles)(({ classes, className, title, children }) => (
  <div className={classes.wrapper}>
    <div
      className={classnames({
        [`${classes.component}`]: true,
        [`${className}`]: className,
      })}
    >
      <h1 className={classes.title}>{title}</h1>
      <Loader color="#FFF" />
      {children && (
        <div className={classes.content}>
          {children}
        </div>
      )}
    </div>
  </div>
));
