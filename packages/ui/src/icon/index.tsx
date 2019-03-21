import * as mdiIcons from '@mdi/js';
import MdiIcon from '@mdi/react';
import { Theme } from '@meetfranz/theme';
import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { IWithStyle } from '../typings/generic';

interface IProps extends IWithStyle {
  icon: keyof typeof mdiIcons;
  size?: number;
  className?: string;
}

const styles = (theme: Theme) => ({
  icon: {
    fill: theme.colorText,
  },
});

class IconComponent extends Component<IProps> {
  public static defaultProps = {
    size: 1,
  };

  render() {
    const {
      classes,
      icon: iconName,
      size,
      className,
    } = this.props;

    let icon = '';
    if (iconName && mdiIcons[iconName]) {
      icon = mdiIcons[iconName];
    } else if (iconName && !mdiIcons[iconName]) {
      console.warn(`Icon '${iconName}' was not found`);
    }

    return (
      <MdiIcon
        path={icon}
        size={size}
        className={classnames({
          [classes.icon]: true,
          [`${className}`]: className,
        })}
      />
    );
  }
}

export const Icon = injectStyle(styles)(IconComponent);
