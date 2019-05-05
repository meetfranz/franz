import { Theme } from '@meetfranz/theme';
import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { Icon, Badge } from '../';
import { IWithStyle } from '../typings/generic';

interface IProps extends IWithStyle {
  badgeClasses?: string;
  iconClasses?: string;
  inverted?: boolean;
}

const styles = (theme: Theme) => ({
  badge: {
    height: 'auto',
    padding: [4, 6, 2, 7],
    borderRadius: theme.borderRadiusSmall,
  },
  invertedBadge: {
    background: theme.styleTypes.primary.contrast,
    color: theme.styleTypes.primary.accent,
  },
  icon: {
    fill: theme.styleTypes.primary.contrast,
  },
  invertedIcon: {
    fill: theme.styleTypes.primary.accent,
  },
});

class ProBadgeComponent extends Component<IProps> {
  render() {
    const {
      classes,
      badgeClasses,
      iconClasses,
      inverted,
    } = this.props;

    return (
      <Badge
        type="primary"
        className={classnames([
          classes.badge,
          inverted && classes.invertedBadge,
          badgeClasses,
        ])}
      >
        <Icon
          icon="mdiStar"
          className={classnames([
            classes.icon,
            inverted && classes.invertedIcon,
            iconClasses,
          ])}
        />
      </Badge>
    );
  }
}

export const ProBadge = injectStyle(styles)(ProBadgeComponent);
