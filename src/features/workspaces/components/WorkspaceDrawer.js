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
    marginLeft: `${theme.workspaceDrawerPadding}px`,
  },
  addWorkspaceButton: {
    float: 'right',
    marginRight: `${theme.workspaceDrawerPadding}px`,
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
});

@injectSheet(styles) @observer
class WorkspaceDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getServicesForWorkspace: PropTypes.func.isRequired,
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
          </div>
        ) : (
          <div className={classes.workspaces}>
            <WorkspaceDrawerItem
              name={intl.formatMessage(messages.allServices)}
              onClick={() => {
                workspaceActions.deactivate();
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
                  workspaceActions.activate({ workspace });
                  gaEvent(GA_CATEGORY_WORKSPACES, 'switch', 'drawer');
                }}
                services={getServicesForWorkspace(workspace)}
              />
            ))}
          </div>
        )}
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}

export default WorkspaceDrawer;
