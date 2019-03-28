import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { Infobox } from '@meetfranz/ui';

import Loader from '../../../components/ui/Loader';
import WorkspaceItem from './WorkspaceItem';
import CreateWorkspaceForm from './CreateWorkspaceForm';
import Request from '../../../stores/lib/Request';
import Appear from '../../../components/ui/effects/Appear';
import { workspaceStore } from '../index';
import PremiumFeatureContainer from '../../../components/ui/PremiumFeatureContainer';

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
  updatedInfo: {
    id: 'settings.workspaces.updatedInfo',
    defaultMessage: '!!!Your changes have been saved',
  },
  deletedInfo: {
    id: 'settings.workspaces.deletedInfo',
    defaultMessage: '!!!Workspace has been deleted',
  },
  workspaceFeatureInfo: {
    id: 'settings.workspaces.workspaceFeatureInfo',
    defaultMessage: '!!!Info about workspace feature',
  },
  workspaceFeatureHeadline: {
    id: 'settings.workspaces.workspaceFeatureHeadline',
    defaultMessage: '!!!Less is More: Introducing Franz Workspaces',
  },
});

const styles = () => ({
  createForm: {
    height: 'auto',
    marginBottom: '20px',
  },
  appear: {
    height: 'auto',
  },
  premiumAnnouncement: {
    padding: '20px',
    backgroundColor: '#3498db',
    marginLeft: '-20px',
    height: 'auto',
  },
});

@injectSheet(styles) @observer
class WorkspacesDashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getUserWorkspacesRequest: PropTypes.instanceOf(Request).isRequired,
    createWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
    deleteWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
    updateWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
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
      createWorkspaceRequest,
      deleteWorkspaceRequest,
      updateWorkspaceRequest,
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

          {/* ===== Workspace updated info ===== */}
          {updateWorkspaceRequest.wasExecuted && updateWorkspaceRequest.result && (
            <Appear className={classes.appear}>
              <Infobox
                type="success"
                icon="mdiCheckboxMarkedCircleOutline"
                dismissable
                onUnmount={updateWorkspaceRequest.reset}
              >
                {intl.formatMessage(messages.updatedInfo)}
              </Infobox>
            </Appear>
          )}

          {/* ===== Workspace deleted info ===== */}
          {deleteWorkspaceRequest.wasExecuted && deleteWorkspaceRequest.result && (
            <Appear className={classes.appear}>
              <Infobox
                type="success"
                icon="mdiCheckboxMarkedCircleOutline"
                dismissable
                onUnmount={deleteWorkspaceRequest.reset}
              >
                {intl.formatMessage(messages.deletedInfo)}
              </Infobox>
            </Appear>
          )}

          <PremiumFeatureContainer
            condition={workspaceStore.isPremiumFeature}
            gaEventInfo={{ category: 'User', event: 'upgrade', label: 'workspaces' }}
          >
            {/* ===== Create workspace form ===== */}
            <div className={classes.createForm}>
              <CreateWorkspaceForm
                isSubmitting={createWorkspaceRequest.isExecuting}
                onSubmit={onCreateWorkspaceSubmit}
              />
            </div>
          </PremiumFeatureContainer>
          {workspaceStore.isUpgradeToPremiumRequired && (
            <div className={classes.premiumAnnouncement}>
              <h2>{intl.formatMessage(messages.workspaceFeatureHeadline)}</h2>
              <p>{intl.formatMessage(messages.workspaceFeatureInfo)}</p>
            </div>
          )}
          {getUserWorkspacesRequest.isExecuting ? (
            <Loader />
          ) : (
            <Fragment>
              {/* ===== Workspace could not be loaded error ===== */}
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
                  {/* ===== Workspaces list ===== */}
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
    );
  }
}

export default WorkspacesDashboard;
