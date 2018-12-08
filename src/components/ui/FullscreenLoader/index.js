import React from 'react';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import { inject } from 'mobx-react';

import Loader from '../Loader';

import styles from './styles';

export default inject('stores')(injectSheet(styles)(({ stores, classes, className, title, children }) => (
    <div className={classes.wrapper}>
      <div
        className={classnames({
          [`${classes.component}`]: true,
          [`${className}`]: className,
        })}
      >
        <h1 className={classes.title}>{title}</h1>
        <Loader color={stores.settings.app.darkMode ? '#FFF' : '#000'} />
        {children && (
          <div className={classes.content}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
  ));
