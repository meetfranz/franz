import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import classnames from 'classnames';

const styles = theme => ({
  item: {
    height: '67px',
    padding: `15px ${theme.workspaceDrawerPadding}px`,
    borderBottom: `1px solid ${theme.workspaceDrawerItemBorder}`,
    '&:first-child': {
      borderTop: `1px solid ${theme.workspaceDrawerItemBorder}`,
    },
  },
  isActiveItem: {
    backgroundColor: theme.workspaceDrawerItemActiveBackground,
  },
  name: {
    marginTop: '4px',
    color: theme.workspaceDrawerItemNameColor,
  },
  activeName: {
    color: theme.workspaceDrawerItemNameActiveColor,
  },
  services: {
    display: 'block',
    fontSize: '11px',
    marginTop: '5px',
    color: theme.workspaceDrawerServicesColor,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: '15px',
  },
  activeServices: {
    color: theme.workspaceDrawerServicesActiveColor,
  },
});

@injectSheet(styles) @observer
class WorkspaceDrawerItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const {
      classes,
      isActive,
      name,
      onClick,
      services,
    } = this.props;
    return (
      <div
        className={classnames([
          classes.item,
          isActive ? classes.isActiveItem : null,
        ])}
        onClick={onClick}
      >
        <span
          className={classnames([
            classes.name,
            isActive ? classes.activeName : null,
          ])}
        >
          {name}
        </span>
        <span
          className={classnames([
            classes.services,
            isActive ? classes.activeServices : null,
          ])}
        >
          {services.join(', ')}
        </span>
      </div>
    );
  }
}

export default WorkspaceDrawerItem;
