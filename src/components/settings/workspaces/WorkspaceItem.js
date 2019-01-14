import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Workspace from '../../../models/Workspace';

// const messages = defineMessages({});

@observer
class WorkspaceItem extends Component {
  static propTypes = {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    onItemClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { workspace, onItemClick } = this.props;
    // const { intl } = this.context;

    return (
      <tr
        className={classnames({
          'workspace-table__row': true,
        })}
      >
        <td
          className="workspace-table__column-name"
          onClick={() => onItemClick(workspace)}
        >
          {workspace.name}
        </td>
      </tr>
    );
  }
}

export default WorkspaceItem;
