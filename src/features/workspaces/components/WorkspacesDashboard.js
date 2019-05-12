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

const styles = theme => ({
  table: {
    width: '100%',
    '& td': {
      padding: '10px',
    },
  },
  createForm: {
    height: 'auto',
  },
  appear: {
    height: 'auto',
  },
  premiumAnnouncement: {
    padding: '20px',
    backgroundColor: '#3498db',
    marginLeft: '-20px',
    marginBottom: '20px',
    height: 'auto',
    color: 'white',
    borderRadius: theme.borderRadius,
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

          {workspaceStore.isPremiumUpgradeRequired && (
            <div className={classes.premiumAnnouncement}>
              <h2>{intl.formatMessage(messages.workspaceFeatureHeadline)}</h2>
              <p>{intl.formatMessage(messages.workspaceFeatureInfo)}</p>
            </div>
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
                  <Fragment>
                    {workspaces.length === 0 ? (
                      <div className="align-middle settings__empty-state">
                        {/* ===== Workspaces empty state ===== */}
                        <p className="settings__empty-text">
                          <span className="emoji">
                            <img src="./assets/images/emoji/sad.png" alt="" />
                          </span>
                          {intl.formatMessage(messages.noServicesAdded)}
                        </p>
                      </div>
                    ) : (
                      <table className={classes.table}>
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
              </Fragment>
            )}
          </PremiumFeatureContainer>
        </div>
      </div>
    );
  }
}

export default WorkspacesDashboard;
