import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { TitleBar } from 'electron-react-titlebar';
import injectSheet from 'react-jss';

import InfoBar from '../ui/InfoBar';
import { Component as DelayApp } from '../../features/delayApp';
import { Component as BasicAuth } from '../../features/basicAuth';
import { Component as ShareFranz } from '../../features/shareFranz';
import ErrorBoundary from '../util/ErrorBoundary';

// import globalMessages from '../../i18n/globalMessages';

import { isWindows } from '../../environment';
import WorkspaceSwitchingIndicator from '../../features/workspaces/components/WorkspaceSwitchingIndicator';
import { workspaceStore } from '../../features/workspaces';
import AppUpdateInfoBar from '../AppUpdateInfoBar';
import TrialActivationInfoBar from '../TrialActivationInfoBar';
import Todos from '../../features/todos/containers/TodosScreen';
import PlanSelection from '../../features/planSelection/containers/PlanSelectionScreen';
import TrialStatusBar from '../../features/trialStatusBar/containers/TrialStatusBarScreen';

function createMarkup(HTMLString) {
  return { __html: HTMLString };
}

const messages = defineMessages({
  servicesUpdated: {
    id: 'infobar.servicesUpdated',
    defaultMessage: '!!!Your services have been updated.',
  },
  buttonReloadServices: {
    id: 'infobar.buttonReloadServices',
    defaultMessage: '!!!Reload services',
  },
  requiredRequestsFailed: {
    id: 'infobar.requiredRequestsFailed',
    defaultMessage: '!!!Could not load services and user information',
  },
});

const styles = theme => ({
  appContent: {
    // width: `calc(100% + ${theme.workspaces.drawer.width}px)`,
    width: '100%',
    transition: 'transform 0.5s ease',
    transform() {
      return workspaceStore.isWorkspaceDrawerOpen ? 'translateX(0)' : `translateX(-${theme.workspaces.drawer.width}px)`;
    },
  },
});

@injectSheet(styles) @observer
class AppLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isFullScreen: PropTypes.bool.isRequired,
    sidebar: PropTypes.element.isRequired,
    workspacesDrawer: PropTypes.element.isRequired,
    services: PropTypes.element.isRequired,
    children: PropTypes.element,
    news: MobxPropTypes.arrayOrObservableArray.isRequired,
    showServicesUpdatedInfoBar: PropTypes.bool.isRequired,
    appUpdateIsDownloaded: PropTypes.bool.isRequired,
    nextAppReleaseVersion: PropTypes.string,
    removeNewsItem: PropTypes.func.isRequired,
    reloadServicesAfterUpdate: PropTypes.func.isRequired,
    installAppUpdate: PropTypes.func.isRequired,
    showRequiredRequestsError: PropTypes.bool.isRequired,
    areRequiredRequestsSuccessful: PropTypes.bool.isRequired,
    retryRequiredRequests: PropTypes.func.isRequired,
    areRequiredRequestsLoading: PropTypes.bool.isRequired,
    isDelayAppScreenVisible: PropTypes.bool.isRequired,
    hasActivatedTrial: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    children: [],
    nextAppReleaseVersion: null,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      isFullScreen,
      workspacesDrawer,
      sidebar,
      services,
      children,
      news,
      showServicesUpdatedInfoBar,
      appUpdateIsDownloaded,
      nextAppReleaseVersion,
      removeNewsItem,
      reloadServicesAfterUpdate,
      installAppUpdate,
      showRequiredRequestsError,
      areRequiredRequestsSuccessful,
      retryRequiredRequests,
      areRequiredRequestsLoading,
      isDelayAppScreenVisible,
      hasActivatedTrial,
    } = this.props;

    const { intl } = this.context;

    return (
      <ErrorBoundary>
        <div className="app">
          {isWindows && !isFullScreen && <TitleBar menu={window.franz.menu.template} icon="assets/images/logo.svg" />}
          <div className={`app__content ${classes.appContent}`}>
            {workspacesDrawer}
            {sidebar}
            <div className="app__service">
              <WorkspaceSwitchingIndicator />
              {news.length > 0 && news.map(item => (
                <InfoBar
                  key={item.id}
                  position="top"
                  type={item.type}
                  sticky={item.sticky}
                  onHide={() => removeNewsItem({ newsId: item.id })}
                >
                  <span
                    dangerouslySetInnerHTML={createMarkup(item.message)}
                    onClick={(event) => {
                      const { target } = event;
                      if (target && target.hasAttribute('data-is-news-cta')) {
                        removeNewsItem({ newsId: item.id });
                      }
                    }}
                  />
                </InfoBar>
              ))}
              {hasActivatedTrial && (
                <TrialActivationInfoBar />
              )}
              {!areRequiredRequestsSuccessful && showRequiredRequestsError && (
              <InfoBar
                type="danger"
                ctaLabel="Try again"
                ctaLoading={areRequiredRequestsLoading}
                sticky
                onClick={retryRequiredRequests}
              >
                <span className="mdi mdi-flash" />
                {intl.formatMessage(messages.requiredRequestsFailed)}
              </InfoBar>
              )}
              {showServicesUpdatedInfoBar && (
                <InfoBar
                  type="primary"
                  ctaLabel={intl.formatMessage(messages.buttonReloadServices)}
                  onClick={reloadServicesAfterUpdate}
                  sticky
                >
                  <span className="mdi mdi-power-plug" />
                  {intl.formatMessage(messages.servicesUpdated)}
                </InfoBar>
              )}
              {appUpdateIsDownloaded && (
                <AppUpdateInfoBar
                  nextAppReleaseVersion={nextAppReleaseVersion}
                  onInstallUpdate={installAppUpdate}
                />
              )}
              {isDelayAppScreenVisible && (<DelayApp />)}
              <BasicAuth />
              <ShareFranz />
              {services}
              {children}
              <TrialStatusBar />
            </div>
            <Todos />
          </div>
          <PlanSelection />
        </div>
      </ErrorBoundary>
    );
  }
}

export default AppLayout;
