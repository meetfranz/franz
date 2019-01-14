import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Loader from '../../ui/Loader';
import WorkspaceItem from './WorkspaceItem';

const messages = defineMessages({
  headline: {
    id: 'settings.workspaces.headline',
    defaultMessage: '!!!Your workspaces',
  },
  noServicesAdded: {
    id: 'settings.workspaces.noWorkspacesAdded',
    defaultMessage: '!!!You haven\'t added any workspaces yet.',
  },
});

@observer
class WorkspacesDashboard extends Component {
  static propTypes = {
    workspaces: MobxPropTypes.arrayOrObservableArray.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { workspaces, isLoading } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          {isLoading ? (
            <Loader />
          ) : (
            <table className="service-table">
              <tbody>
                {workspaces.map(workspace => <WorkspaceItem workspace={workspace} />)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default WorkspacesDashboard;
