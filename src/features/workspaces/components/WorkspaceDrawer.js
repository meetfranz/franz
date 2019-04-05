import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, FormattedHTMLMessage, intlShape } from 'react-intl';
import { H1, Icon } from '@meetfranz/ui';
import { Button } from '@meetfranz/forms/lib';
import ReactTooltip from 'react-tooltip';

import WorkspaceDrawerItem from './WorkspaceDrawerItem';
import { workspaceActions } from '../actions';
import { GA_CATEGORY_WORKSPACES, workspaceStore } from '../index';
import { gaEvent } from '../../../lib/analytics';

const messages = defineMessages({
  headline: {
    id: 'workspaceDrawer.headline',
    defaultMessage: '!!!Workspaces',
  },
  allServices: {
    id: 'workspaceDrawer.allServices',
    defaultMessage: '!!!All services',
  },
  addWorkspaceTooltip: {
    id: 'workspaceDrawer.addWorkspaceTooltip',
    defaultMessage: '!!!Add workspace',
  },
  workspaceFeatureInfo: {
    id: 'workspaceDrawer.workspaceFeatureInfo',
    defaultMessage: '!!!Info about workspace feature',
  },
  premiumCtaButtonLabel: {
    id: 'workspaceDrawer.premiumCtaButtonLabel',
    defaultMessage: '!!!Create your first workspace',
  },
  reactivatePremiumAccount: {
    id: 'workspaceDrawer.reactivatePremiumAccountLabel',
    defaultMessage: '!!!Reactivate premium account',
  },
  addNewWorkspaceLabel: {
    id: 'workspaceDrawer.addNewWorkspaceLabel',
    defaultMessage: '!!!add new workspace',
  },
});

const styles = theme => ({
  drawer: {
    backgroundColor: theme.workspaceDrawerBackground,
    width: `${theme.workspaceDrawerWidth}px`,
  },
  headline: {
    fontSize: '24px',
    marginTop: '38px',
    marginBottom: '25px',
    marginLeft: theme.workspaceDrawerPadding,
  },
  addWorkspaceButton: {
    float: 'right',
    marginRight: theme.workspaceDrawerPadding,
    marginTop: '2px',
  },
  addWorkspaceButtonIcon: {
    fill: theme.workspaceDrawerAddButtonColor,
    '&:hover': {
      fill: theme.workspaceDrawerAddButtonHoverColor,
    },
  },
  workspaces: {
    height: 'auto',
  },
  premiumAnnouncement: {
    padding: '20px',
    paddingTop: '0',
    height: 'auto',
  },
  premiumCtaButton: {
    marginTop: '20px',
    width: '100%',
    color: 'white !important',
  },
  addNewWorkspaceLabel: {
    height: 'auto',
    color: theme.workspaceDrawerServicesColor,
    marginTop: 20,
    marginLeft: theme.workspaceDrawerPadding,
    '& > span': {
      fontSize: '13px',
      marginLeft: 10,
      position: 'relative',
      top: -3,
    },
    '&:hover': {
      color: theme.workspaceDrawerAddButtonHoverColor,
      '& > svg': {
        fill: theme.workspaceDrawerAddButtonHoverColor,
      },
    },
  },
});

@injectSheet(styles) @observer
class WorkspaceDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getServicesForWorkspace: PropTypes.func.isRequired,
    onUpgradeAccountClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      classes,
      getServicesForWorkspace,
      onUpgradeAccountClick,
    } = this.props;
    const { intl } = this.context;
    const {
      activeWorkspace,
      isSwitchingWorkspace,
      nextWorkspace,
      workspaces,
    } = workspaceStore;
    const actualWorkspace = isSwitchingWorkspace ? nextWorkspace : activeWorkspace;
    return (
      <div className={classes.drawer}>
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.headline)}
          <span
            className={classes.addWorkspaceButton}
            onClick={() => {
              workspaceActions.openWorkspaceSettings();
              gaEvent(GA_CATEGORY_WORKSPACES, 'add', 'drawerHeadline');
            }}
            data-tip={`${intl.formatMessage(messages.addWorkspaceTooltip)}`}
          >
            <Icon
              icon="mdiPlusBox"
              size={1.5}
              className={classes.addWorkspaceButtonIcon}
            />
          </span>
        </H1>
        {workspaceStore.isPremiumUpgradeRequired ? (
          <div className={classes.premiumAnnouncement}>
            <FormattedHTMLMessage {...messages.workspaceFeatureInfo} />
            {workspaceStore.userHasWorkspaces ? (
              <Button
                className={classes.premiumCtaButton}
                buttonType="primary"
                label={intl.formatMessage(messages.reactivatePremiumAccount)}
                icon="mdiStar"
                onClick={() => {
                  onUpgradeAccountClick();
                  gaEvent('User', 'upgrade', 'workspaceDrawer');
                }}
              />
            ) : (
              <Button
                className={classes.premiumCtaButton}
                buttonType="primary"
                label={intl.formatMessage(messages.premiumCtaButtonLabel)}
                icon="mdiPlusBox"
                onClick={() => {
                  workspaceActions.openWorkspaceSettings();
                  gaEvent(GA_CATEGORY_WORKSPACES, 'add', 'drawerPremiumCta');
                }}
              />
            )}
          </div>
        ) : (
          <div className={classes.workspaces}>
            <WorkspaceDrawerItem
              name={intl.formatMessage(messages.allServices)}
              onClick={() => {
                workspaceActions.deactivate();
                workspaceActions.toggleWorkspaceDrawer();
                gaEvent(GA_CATEGORY_WORKSPACES, 'switch', 'drawer');
              }}
              services={getServicesForWorkspace(null)}
              isActive={actualWorkspace == null}
            />
            {workspaces.map(workspace => (
              <WorkspaceDrawerItem
                key={workspace.id}
                name={workspace.name}
                isActive={actualWorkspace === workspace}
                onClick={() => {
                  if (actualWorkspace === workspace) return;
                  workspaceActions.activate({ workspace });
                  workspaceActions.toggleWorkspaceDrawer();
                  gaEvent(GA_CATEGORY_WORKSPACES, 'switch', 'drawer');
                }}
                services={getServicesForWorkspace(workspace)}
              />
            ))}
          </div>
        )}
        <div
          className={classes.addNewWorkspaceLabel}
          onClick={() => {
            workspaceActions.openWorkspaceSettings();
            gaEvent(GA_CATEGORY_WORKSPACES, 'add', 'drawerAddLabel');
          }}
        >
          <Icon
            icon="mdiPlusBox"
            size={1}
            className={classes.addWorkspaceButtonIcon}
          />
          <span>
            {intl.formatMessage(messages.addNewWorkspaceLabel)}
          </span>
        </div>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}

export default WorkspaceDrawer;
