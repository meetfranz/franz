import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';

import Workspace from '../models/Workspace';

const styles = theme => ({
  row: {
    height: 57,
    borderBottom: `1px solid ${theme.workspaceSettings.listItemBorderColor}`,
    '&:hover': {
      background: theme.workspaceSettings.listItemHoverBgColor,
    },
  },
  columnName: {},
});

@injectSheet(styles) @observer
class WorkspaceItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    onItemClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes, workspace, onItemClick } = this.props;

    return (
      <tr className={classes.row}>
        <td onClick={() => onItemClick(workspace)}>
          {workspace.name}
        </td>
      </tr>
    );
  }
}

export default WorkspaceItem;
