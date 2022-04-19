import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import InfoBar from '../ui/InfoBar';
import { Component as DelayApp } from '../../features/delayApp';
import ErrorBoundary from '../util/ErrorBoundary';

import WorkspaceSwitchingIndicator from '../../features/workspaces/components/WorkspaceSwitchingIndicator';
import AppUpdateInfoBar from '../AppUpdateInfoBar';
import TrialActivationInfoBar from '../TrialActivationInfoBar';
import Todos from '../../features/todos/containers/TodosScreen';
import TrialStatusBar from '../../features/trialStatusBar/containers/TrialStatusBarScreen';
import WebControlsScreen from '../../features/webControls/containers/WebControlsScreen';
import Service from '../../models/Service';
import { workspaceStore } from '../../features/workspaces';
import AppMenuBar from '../../features/appMenu';
import { isMac } from '../../environment';

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

const styles = {
  appContent: {
    width: '100%',
  },
};

@injectSheet(styles) @observer
class AppLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    showWebControls: PropTypes.bool.isRequired,
    activeService: PropTypes.instanceOf(Service),
  };

  static defaultProps = {
    children: [],
    nextAppReleaseVersion: null,
    activeService: null,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
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
      showWebControls,
      activeService,
    } = this.props;

    const { intl } = this.context;

    return (
      <ErrorBoundary>
        {!isMac && <AppMenuBar />}
        <div className="app">
          <div className={`app__content ${classes.appContent}`}>
            {workspacesDrawer}
            {sidebar}
            <div className="app__service">
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
              {showWebControls && activeService && (
                <WebControlsScreen service={activeService} />
              )}
              {appUpdateIsDownloaded && (
                <AppUpdateInfoBar
                  nextAppReleaseVersion={nextAppReleaseVersion}
                  onInstallUpdate={installAppUpdate}
                />
              )}
              {isDelayAppScreenVisible ? <DelayApp /> : (
                <>
                  <WorkspaceSwitchingIndicator />
                  {!workspaceStore.isSwitchingWorkspace && (
                    <div className="app__service-size-container">
                      {services}
                      {children}
                      <Todos />
                    </div>
                  )}
                </>
              )}
              <TrialStatusBar />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default AppLayout;
