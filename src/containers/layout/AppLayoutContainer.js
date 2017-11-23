import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import AppStore from '../../stores/AppStore';
import RecipesStore from '../../stores/RecipesStore';
import ServicesStore from '../../stores/ServicesStore';
import UIStore from '../../stores/UIStore';
import NewsStore from '../../stores/NewsStore';
import SettingsStore from '../../stores/SettingsStore';
import RequestStore from '../../stores/RequestStore';
import GlobalErrorStore from '../../stores/GlobalErrorStore';

import { oneOrManyChildElements } from '../../prop-types';
import AppLayout from '../../components/layout/AppLayout';
import Sidebar from '../../components/layout/Sidebar';
import Services from '../../components/services/content/Services';
import AppLoader from '../../components/ui/AppLoader';

@inject('stores', 'actions') @observer
export default class AppLayoutContainer extends Component {
  static defaultProps = {
    children: null,
  };

  render() {
    const {
      app,
      services,
      ui,
      news,
      settings,
      globalError,
      requests,
    } = this.props.stores;

    const {
      setActive,
      handleIPCMessage,
      setWebviewReference,
      openWindow,
      reloadUpdatedServices,
      reorder,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      updateService,
    } = this.props.actions.service;

    const { hide } = this.props.actions.news;

    const { retryRequiredRequests } = this.props.actions.requests;

    const {
      installUpdate,
      toggleMuteApp,
    } = this.props.actions.app;

    const {
      openSettings,
      closeSettings,
    } = this.props.actions.ui;

    const { children } = this.props;

    const isLoadingServices = services.allServicesRequest.isExecuting
      && services.allServicesRequest.isExecutingFirstTime;

    if (isLoadingServices) {
      return (
        <AppLoader />
      );
    }

    const isMuted = settings.all.isAppMuted || app.isSystemMuted;

    const sidebar = (
      <Sidebar
        services={services.allDisplayed}
        setActive={setActive}
        isAppMuted={isMuted}
        openSettings={openSettings}
        closeSettings={closeSettings}
        reorder={reorder}
        reload={reload}
        toggleNotifications={toggleNotifications}
        toggleAudio={toggleAudio}
        deleteService={deleteService}
        updateService={updateService}
        toggleMuteApp={toggleMuteApp}
      />
    );

    const servicesContainer = (
      <Services
        services={services.allDisplayed}
        handleIPCMessage={handleIPCMessage}
        setWebviewReference={setWebviewReference}
        openWindow={openWindow}
        reload={reload}
        isAppMuted={isMuted}
        update={updateService}
      />
    );

    return (
      <AppLayout
        isOnline={app.isOnline}
        showServicesUpdatedInfoBar={ui.showServicesUpdatedInfoBar}
        appUpdateIsDownloaded={app.updateStatus === app.updateStatusTypes.DOWNLOADED}
        sidebar={sidebar}
        services={servicesContainer}
        news={news.latest}
        removeNewsItem={hide}
        reloadServicesAfterUpdate={reloadUpdatedServices}
        installAppUpdate={installUpdate}
        globalError={globalError.error}
        showRequiredRequestsError={requests.showRequiredRequestsError}
        areRequiredRequestsSuccessful={requests.areRequiredRequestsSuccessful}
        retryRequiredRequests={retryRequiredRequests}
        areRequiredRequestsLoading={requests.areRequiredRequestsLoading}
      >
        {React.Children.count(children) > 0 ? children : null}
      </AppLayout>
    );
  }
}

AppLayoutContainer.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
    recipes: PropTypes.instanceOf(RecipesStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
    ui: PropTypes.instanceOf(UIStore).isRequired,
    news: PropTypes.instanceOf(NewsStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    requests: PropTypes.instanceOf(RequestStore).isRequired,
    globalError: PropTypes.instanceOf(GlobalErrorStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.shape({
      setActive: PropTypes.func.isRequired,
      reload: PropTypes.func.isRequired,
      toggleNotifications: PropTypes.func.isRequired,
      toggleAudio: PropTypes.func.isRequired,
      handleIPCMessage: PropTypes.func.isRequired,
      setWebviewReference: PropTypes.func.isRequired,
      openWindow: PropTypes.func.isRequired,
      reloadUpdatedServices: PropTypes.func.isRequired,
      updateService: PropTypes.func.isRequired,
      deleteService: PropTypes.func.isRequired,
      reorder: PropTypes.func.isRequired,
    }).isRequired,
    news: PropTypes.shape({
      hide: PropTypes.func.isRequired,
    }).isRequired,
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
      closeSettings: PropTypes.func.isRequired,
    }).isRequired,
    app: PropTypes.shape({
      installUpdate: PropTypes.func.isRequired,
      toggleMuteApp: PropTypes.func.isRequired,
    }).isRequired,
    requests: PropTypes.shape({
      retryRequiredRequests: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  children: oneOrManyChildElements,
};
