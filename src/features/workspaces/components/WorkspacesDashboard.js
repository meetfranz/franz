import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import Loader from '../../../components/ui/Loader';
import WorkspaceItem from './WorkspaceItem';
import CreateWorkspaceForm from './CreateWorkspaceForm';
import Request from '../../../stores/lib/Request';
import Infobox from '../../../components/ui/Infobox';

const messages = defineMessages({
  headline: {
    id: 'settings.workspaces.headline',
    defaultMessage: '!!!Your workspaces',
  },
  noServicesAdded: {
    id: 'settings.workspaces.noWorkspacesAdded',
    defaultMessage: '!!!You haven\'t added any workspaces yet.',
  },
  workspacesRequestFailed: {
    id: 'settings.workspaces.workspacesRequestFailed',
    defaultMessage: '!!!Could not load your workspaces',
  },
  tryReloadWorkspaces: {
    id: 'settings.workspaces.tryReloadWorkspaces',
    defaultMessage: '!!!Try again',
  },
});

const styles = () => ({
  createForm: {
    height: 'auto',
    marginBottom: '20px',
  },
});

@injectSheet(styles) @observer
class WorkspacesDashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getUserWorkspacesRequest: PropTypes.instanceOf(Request).isRequired,
    onCreateWorkspaceSubmit: PropTypes.func.isRequired,
    onWorkspaceClick: PropTypes.func.isRequired,
    workspaces: MobxPropTypes.arrayOrObservableArray.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      getUserWorkspacesRequest,
      onCreateWorkspaceSubmit,
      onWorkspaceClick,
      workspaces,
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
            {getUserWorkspacesRequest.isExecuting ? (
              <Loader />
            ) : (
              <Fragment>
                {getUserWorkspacesRequest.error ? (
                  <Infobox
                    icon="alert"
                    type="danger"
                    ctaLabel={intl.formatMessage(messages.tryReloadWorkspaces)}
                    ctaLoading={getUserWorkspacesRequest.isExecuting}
                    ctaOnClick={getUserWorkspacesRequest.retry}
                  >
                    {intl.formatMessage(messages.workspacesRequestFailed)}
                  </Infobox>
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
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default WorkspacesDashboard;
