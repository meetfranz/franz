import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { TitleBar } from 'electron-react-titlebar';

import InfoBar from '../ui/InfoBar';
import globalMessages from '../../i18n/globalMessages';

import { isMac } from '../../environment';

function createMarkup(HTMLString) {
  return { __html: HTMLString };
}

const messages = defineMessages({
  servicesUpdated: {
    id: 'infobar.servicesUpdated',
    defaultMessage: '!!!Your services have been updated.',
  },
  updateAvailable: {
    id: 'infobar.updateAvailable',
    defaultMessage: '!!!A new update for Franz is available.',
  },
  buttonReloadServices: {
    id: 'infobar.buttonReloadServices',
    defaultMessage: '!!!Reload services',
  },
  changelog: {
    id: 'infobar.buttonChangelog',
    defaultMessage: '!!!Changelog',
  },
  buttonInstallUpdate: {
    id: 'infobar.buttonInstallUpdate',
    defaultMessage: '!!!Restart & install update',
  },
  requiredRequestsFailed: {
    id: 'infobar.requiredRequestsFailed',
    defaultMessage: '!!!Could not load services and user information',
  },
});

@observer
export default class AppLayout extends Component {
  static propTypes = {
    sidebar: PropTypes.element.isRequired,
    services: PropTypes.element.isRequired,
    children: PropTypes.element,
    news: MobxPropTypes.arrayOrObservableArray.isRequired,
    isOnline: PropTypes.bool.isRequired,
    showServicesUpdatedInfoBar: PropTypes.bool.isRequired,
    appUpdateIsDownloaded: PropTypes.bool.isRequired,
    removeNewsItem: PropTypes.func.isRequired,
    reloadServicesAfterUpdate: PropTypes.func.isRequired,
    installAppUpdate: PropTypes.func.isRequired,
    showRequiredRequestsError: PropTypes.bool.isRequired,
    areRequiredRequestsSuccessful: PropTypes.bool.isRequired,
    retryRequiredRequests: PropTypes.func.isRequired,
    areRequiredRequestsLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    children: [],
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      sidebar,
      services,
      children,
      isOnline,
      news,
      showServicesUpdatedInfoBar,
      appUpdateIsDownloaded,
      removeNewsItem,
      reloadServicesAfterUpdate,
      installAppUpdate,
      showRequiredRequestsError,
      areRequiredRequestsSuccessful,
      retryRequiredRequests,
      areRequiredRequestsLoading,
    } = this.props;

    const { intl } = this.context;

    return (
      <div>
        <div className="app">
          {!isMac && <TitleBar menu={window.franz.menu.template} icon={'assets/images/logo.svg'} />}
          <div className="app__content">
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
                  <span dangerouslySetInnerHTML={createMarkup(item.message)} />
                </InfoBar>
              ))}
              {!isOnline && (
                <InfoBar
                  type="danger"
                >
                  <span className="mdi mdi-flash" />
                  {intl.formatMessage(globalMessages.notConnectedToTheInternet)}
                </InfoBar>
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
                <InfoBar
                  type="primary"
                  ctaLabel={intl.formatMessage(messages.buttonInstallUpdate)}
                  onClick={installAppUpdate}
                  sticky
                >
                  <span className="mdi mdi-information" />
                  {intl.formatMessage(messages.updateAvailable)} <a href="https://meetfranz.com/changelog" target="_blank">
                    <u>{intl.formatMessage(messages.changelog)}</u>
                  </a>
                </InfoBar>
              )}
              {services}
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }
}
