import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import AppStore from '../../stores/AppStore';
import RecipesStore from '../../stores/RecipesStore';
import ServicesStore from '../../stores/ServicesStore';
import UIStore from '../../stores/UIStore';
import NewsStore from '../../stores/NewsStore';
import UserStore from '../../stores/UserStore';
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
      globalError,
      user,
      requests,
    } = this.props.stores;

    const {
      setActive,
      setActiveNext,
      setActivePrev,
      handleIPCMessage,
      setWebviewReference,
      openWindow,
      reloadUpdatedServices,
      reorder,
      reload,
      toggleNotifications,
      deleteService,
      updateService,
    } = this.props.actions.service;

    const { hide } = this.props.actions.news;

    const { retryRequiredRequests } = this.props.actions.requests;

    const {
      installUpdate,
    } = this.props.actions.app;

    const {
      openSettings,
      closeSettings,
    } = this.props.actions.ui;

    const { children } = this.props;
    const allServices = services.enabled;

    const isLoadingServices = services.allServicesRequest.isExecuting
      && services.allServicesRequest.isExecutingFirstTime;

    // const isLoadingRecipes = recipes.allRecipesRequest.isExecuting
    //   && recipes.allRecipesRequest.isExecutingFirstTime;

    if (isLoadingServices) {
      return (
        <AppLoader />
      );
    }

    const sidebar = (
      <Sidebar
        services={allServices}
        setActive={setActive}
        setActiveNext={setActiveNext}
        setActivePrev={setActivePrev}
        openSettings={openSettings}
        closeSettings={closeSettings}
        reorder={reorder}
        reload={reload}
        toggleNotifications={toggleNotifications}
        deleteService={deleteService}
        updateService={updateService}
        isPremiumUser={user.data.isPremium}
      />
    );

    const servicesContainer = (
      <Services
        // settings={allSettings}
        services={allServices}
        handleIPCMessage={handleIPCMessage}
        setWebviewReference={setWebviewReference}
        openWindow={openWindow}
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
    user: PropTypes.instanceOf(UserStore).isRequired,
    requests: PropTypes.instanceOf(RequestStore).isRequired,
    globalError: PropTypes.instanceOf(GlobalErrorStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.shape({
      setActive: PropTypes.func.isRequired,
      setActiveNext: PropTypes.func.isRequired,
      setActivePrev: PropTypes.func.isRequired,
      reload: PropTypes.func.isRequired,
      toggleNotifications: PropTypes.func.isRequired,
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
      healthCheck: PropTypes.func.isRequired,
    }).isRequired,
    requests: PropTypes.shape({
      retryRequiredRequests: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  children: oneOrManyChildElements,
};
