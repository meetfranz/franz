import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import Loader from '../../../components/ui/Loader';
import WorkspaceItem from './WorkspaceItem';
import CreateWorkspaceForm from './CreateWorkspaceForm';

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

const styles = () => ({
  createForm: {
    height: 'auto',
    marginBottom: '20px',
  },
});

@observer @injectSheet(styles)
class WorkspacesDashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoadingWorkspaces: PropTypes.bool.isRequired,
    onCreateWorkspaceSubmit: PropTypes.func.isRequired,
    onWorkspaceClick: PropTypes.func.isRequired,
    workspaces: MobxPropTypes.arrayOrObservableArray.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      workspaces,
      isLoadingWorkspaces,
      onCreateWorkspaceSubmit,
      onWorkspaceClick,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          <div className={classes.body}>
            <div className={classes.createForm}>
              <CreateWorkspaceForm onSubmit={onCreateWorkspaceSubmit} />
            </div>
            {isLoadingWorkspaces ? (
              <Loader />
            ) : (
              <table className="workspace-table">
                <tbody>
                  {workspaces.map(workspace => (
                    <WorkspaceItem
                      key={workspace.id}
                      workspace={workspace}
                      onItemClick={w => onWorkspaceClick(w)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default WorkspacesDashboard;
