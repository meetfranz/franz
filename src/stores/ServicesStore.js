import {
  action,
  reaction,
  computed,
  observable,
  toJS,
} from 'mobx';
import { debounce, remove } from 'lodash';
import ms from 'ms';
import { remote } from 'electron';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { matchRoute } from '../helpers/routing-helpers';
import { gaEvent, statsEvent } from '../lib/analytics';
import { workspaceStore } from '../features/workspaces';
import { serviceLimitStore } from '../features/serviceLimit';
import { RESTRICTION_TYPES } from '../models/Service';
import { TODOS_RECIPE_ID } from '../features/todos';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';

const debug = require('debug')('Franz:ServiceStore');

const { app } = remote;

export default class ServicesStore extends Store {
  @observable allServicesRequest = new CachedRequest(this.api.services, 'all');

  @observable createServiceRequest = new Request(this.api.services, 'create');

  @observable updateServiceRequest = new Request(this.api.services, 'update');

  @observable reorderServicesRequest = new Request(this.api.services, 'reorder');

  @observable deleteServiceRequest = new Request(this.api.services, 'delete');

  @observable clearCacheRequest = new Request(this.api.services, 'clearCache');

  @observable filterNeedle = null;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.service.setActive.listen(this._setActive.bind(this));
    this.actions.service.blurActive.listen(this._blurActive.bind(this));
    this.actions.service.setActiveNext.listen(this._setActiveNext.bind(this));
    this.actions.service.setActivePrev.listen(this._setActivePrev.bind(this));
    this.actions.service.showAddServiceInterface.listen(this._showAddServiceInterface.bind(this));
    this.actions.service.createService.listen(this._createService.bind(this));
    this.actions.service.createFromLegacyService.listen(this._createFromLegacyService.bind(this));
    this.actions.service.updateService.listen(this._updateService.bind(this));
    this.actions.service.deleteService.listen(this._deleteService.bind(this));
    this.actions.service.clearCache.listen(this._clearCache.bind(this));
    this.actions.service.setWebviewReference.listen(this._setWebviewReference.bind(this));
    this.actions.service.detachService.listen(this._detachService.bind(this));
    this.actions.service.focusService.listen(this._focusService.bind(this));
    this.actions.service.focusActiveService.listen(this._focusActiveService.bind(this));
    this.actions.service.toggleService.listen(this._toggleService.bind(this));
    this.actions.service.handleIPCMessage.listen(this._handleIPCMessage.bind(this));
    this.actions.service.sendIPCMessage.listen(this._sendIPCMessage.bind(this));
    this.actions.service.sendIPCMessageToAllServices.listen(this._sendIPCMessageToAllServices.bind(this));
    this.actions.service.setUnreadMessageCount.listen(this._setUnreadMessageCount.bind(this));
    this.actions.service.openWindow.listen(this._openWindow.bind(this));
    this.actions.service.filter.listen(this._filter.bind(this));
    this.actions.service.resetFilter.listen(this._resetFilter.bind(this));
    this.actions.service.resetStatus.listen(this._resetStatus.bind(this));
    this.actions.service.reload.listen(this._reload.bind(this));
    this.actions.service.reloadActive.listen(this._reloadActive.bind(this));
    this.actions.service.reloadAll.listen(this._reloadAll.bind(this));
    this.actions.service.reloadUpdatedServices.listen(this._reloadUpdatedServices.bind(this));
    this.actions.service.reorder.listen(this._reorder.bind(this));
    this.actions.service.toggleNotifications.listen(this._toggleNotifications.bind(this));
    this.actions.service.toggleAudio.listen(this._toggleAudio.bind(this));
    this.actions.service.openDevTools.listen(this._openDevTools.bind(this));
    this.actions.service.openDevToolsForActiveService.listen(this._openDevToolsForActiveService.bind(this));
    this.actions.service.hibernate.listen(this._hibernate.bind(this));
    this.actions.service.awake.listen(this._awake.bind(this));
    this.actions.service.resetLastPollTimer.listen(this._resetLastPollTimer.bind(this));

    this.registerReactions([
      this._focusServiceReaction.bind(this),
      this._getUnreadMessageCountReaction.bind(this),
      this._mapActiveServiceToServiceModelReaction.bind(this),
      this._saveActiveService.bind(this),
      this._logoutReaction.bind(this),
      this._handleMuteSettings.bind(this),
      this._restrictServiceAccess.bind(this),
      this._checkForActiveService.bind(this),
    ]);

    // Just bind this
    this._initializeServiceRecipeInWebview.bind(this);
  }

  setup() {
    // Single key reactions for the sake of your CPU
    reaction(
      () => this.stores.settings.app.enableSpellchecking,
      () => this._shareSettingsWithServiceProcess(),
    );

    reaction(
      () => this.stores.settings.app.spellcheckerLanguage,
      () => this._shareSettingsWithServiceProcess(),
    );
  }

  initialize() {
    super.initialize();

    // Check services to become hibernated
    this.serviceMaintenanceTick();
  }

  teardown() {
    super.teardown();

    // Stop checking services for hibernation
    this.serviceMaintenanceTick.cancel();
  }

  /**
   * Сheck for services to become hibernated.
   */
  serviceMaintenanceTick = debounce(() => {
    this._serviceMaintenance();
    this.serviceMaintenanceTick();
    debug('Service maintenance tick');
  }, ms('10s'));

  /**
   * Run various maintenance tasks on services
   */
  _serviceMaintenance() {
    this.all.forEach((service) => {
      // Defines which services should be hibernated.
      if (!service.isActive && (Date.now() - service.lastUsed > ms('5m'))) {
        // If service is stale for 5 min, hibernate it.
        this._hibernate({ serviceId: service.id });
      }

      if (service.lastPoll && (service.lastPoll - service.lastPollAnswer > ms('1m'))) {
        // If service did not reply for more than 1m try to reload.
        if (!service.isActive) {
          if (this.stores.app.isOnline && service.lostRecipeReloadAttempt < 3) {
            debug(`Reloading service: ${service.name} (${service.id}). Attempt: ${service.lostRecipeReloadAttempt}`);
            // service.webview.reload();
            service.lostRecipeReloadAttempt += 1;

            service.lostRecipeConnection = false;
          }
        } else {
          debug(`Service lost connection: ${service.name} (${service.id}).`);
          service.lostRecipeConnection = true;
        }
      } else {
        service.lostRecipeConnection = false;
        service.lostRecipeReloadAttempt = 0;
      }
    });
  }

  // Computed props
  @computed get all() {
    if (this.stores.user.isLoggedIn) {
      const services = this.allServicesRequest.execute().result;
      if (services) {
        return observable(services.slice().slice().sort((a, b) => a.order - b.order).map((s, index) => {
          s.index = index;
          return s;
        }));
      }
    }
    return [];
  }

  @computed get enabled() {
    return this.all.filter(service => service.isEnabled);
  }

  @computed get allDisplayed() {
    const services = this.stores.settings.all.app.showDisabledServices ? this.all : this.enabled;
    return workspaceStore.filterServicesByActiveWorkspace(services);
  }

  // This is just used to avoid unnecessary rerendering of resource-heavy webviews
  @computed get allDisplayedUnordered() {
    const { showDisabledServices } = this.stores.settings.all.app;
    const { keepAllWorkspacesLoaded } = this.stores.workspaces.settings;
    const services = this.allServicesRequest.execute().result || [];
    const filteredServices = showDisabledServices ? services : services.filter(service => service.isEnabled);
    return keepAllWorkspacesLoaded ? filteredServices : workspaceStore.filterServicesByActiveWorkspace(filteredServices);
  }

  @computed get filtered() {
    return this.all.filter(service => service.name.toLowerCase().includes(this.filterNeedle.toLowerCase()));
  }

  @computed get active() {
    return this.all.find(service => service.isActive);
  }

  @computed get activeSettings() {
    const match = matchRoute('/settings/services/edit/:id', this.stores.router.location.pathname);
    if (match) {
      const activeService = this.one(match.id);
      if (activeService) {
        return activeService;
      }

      debug('Service not available');
    }

    return null;
  }

  @computed get isTodosServiceAdded() {
    return this.allDisplayed.find(service => service.recipe.id === TODOS_RECIPE_ID && service.isEnabled) || null;
  }

  @computed get isTodosServiceActive() {
    return this.active && this.active.recipe.id === TODOS_RECIPE_ID;
  }

  one(id) {
    return this.all.find(service => service.id === id);
  }

  async _showAddServiceInterface({ recipeId }) {
    this.stores.router.push(`/settings/services/add/${recipeId}`);
  }

  // Actions
  async _createService({
    recipeId, serviceData, redirect = true, skipCleanup = false,
  }) {
    if (serviceLimitStore.userHasReachedServiceLimit) return;

    if (!this.stores.recipes.isInstalled(recipeId)) {
      debug(`Recipe "${recipeId}" is not installed, installing recipe`);
      await this.stores.recipes._install({ recipeId });
      debug(`Recipe "${recipeId}" installed`);
    }

    // set default values for serviceData
    Object.assign({
      isEnabled: true,
      isHibernationEnabled: false,
      isNotificationEnabled: true,
      isBadgeEnabled: true,
      isMuted: false,
      customIcon: false,
      isDarkModeEnabled: false,
      spellcheckerLanguage: SPELLCHECKER_LOCALES[this.stores.settings.app.spellcheckerLanguage],
    }, serviceData);

    let data = serviceData;

    if (!skipCleanup) {
      data = this._cleanUpTeamIdAndCustomUrl(recipeId, serviceData);
    }

    const response = await this.createServiceRequest.execute(recipeId, data)._promise;

    this.allServicesRequest.patch((result) => {
      if (!result) return;
      result.push(response.data);
    });

    this.actions.settings.update({
      type: 'proxy',
      data: {
        [`${response.data.id}`]: data.proxy,
      },
    });

    this.actionStatus = response.status || [];

    if (redirect) {
      this.stores.router.push('/settings/recipes');
      gaEvent('Service', 'create', recipeId);
    }
  }

  @action async _createFromLegacyService({ data }) {
    const { id } = data.recipe;
    const serviceData = {};

    if (data.name) {
      serviceData.name = data.name;
    }

    if (data.team && !data.customURL) {
      serviceData.team = data.team;
    }

    if (data.team && data.customURL) {
      serviceData.customUrl = data.team;
    }

    this.actions.service.createService({
      recipeId: id,
      serviceData,
      redirect: false,
    });
  }

  @action async _updateService({ serviceId, serviceData, redirect = true }) {
    const service = this.one(serviceId);
    const data = this._cleanUpTeamIdAndCustomUrl(service.recipe.id, serviceData);
    const request = this.updateServiceRequest.execute(serviceId, data);

    const newData = serviceData;
    if (serviceData.iconFile) {
      await request._promise;

      newData.iconUrl = request.result.data.iconUrl;
      newData.hasCustomUploadedIcon = true;
    }

    this.allServicesRequest.patch((result) => {
      if (!result) return;

      // patch custom icon deletion
      if (data.customIcon === 'delete') {
        newData.iconUrl = '';
        newData.hasCustomUploadedIcon = false;
      }

      // patch custom icon url
      if (data.customIconUrl) {
        newData.iconUrl = data.customIconUrl;
      }

      Object.assign(result.find(c => c.id === serviceId), newData);
    });

    await request._promise;
    this.actionStatus = request.result.status;

    if (service.isEnabled) {
      this._sendIPCMessage({
        serviceId,
        channel: 'service-settings-update',
        args: newData,
      });
    }

    this.actions.settings.update({
      type: 'proxy',
      data: {
        [`${serviceId}`]: data.proxy,
      },
    });

    if (redirect) {
      this.stores.router.push('/settings/services');
      gaEvent('Service', 'update', service.recipe.id);
    }
  }

  @action async _deleteService({ serviceId, redirect }) {
    const request = this.deleteServiceRequest.execute(serviceId);

    if (redirect) {
      this.stores.router.push(redirect);
    }

    this.allServicesRequest.patch((result) => {
      remove(result, c => c.id === serviceId);
    });

    const service = this.one(serviceId);

    await request._promise;
    this.actionStatus = request.result.status;

    gaEvent('Service', 'delete', service.recipe.id);
  }

  @action async _clearCache({ serviceId }) {
    this.clearCacheRequest.reset();
    const request = this.clearCacheRequest.execute(serviceId);
    await request._promise;
    gaEvent('Service', 'clear cache');
  }

  @action _setActive({ serviceId, keepActiveRoute }) {
    if (!keepActiveRoute) this.stores.router.push('/');
    const service = this.one(serviceId);

    this.all.forEach((s, index) => {
      this.all[index].isActive = false;
    });
    service.isActive = true;
    this._awake({ serviceId: service.id });
    service.lastUsed = Date.now();

    if (this.active.recipe.id === TODOS_RECIPE_ID && !this.stores.todos.settings.isFeatureEnabledByUser) {
      this.actions.todos.toggleTodosFeatureVisibility();
    }

    statsEvent('activate-service', service.recipe.id);

    this._focusActiveService();
  }

  @action _blurActive() {
    if (!this.active) return;
    this.active.isActive = false;
  }

  @action _setActiveNext() {
    const nextIndex = this._wrapIndex(this.allDisplayed.findIndex(service => service.isActive), 1, this.allDisplayed.length);

    // TODO: simplify this;
    this.all.forEach((s, index) => {
      this.all[index].isActive = false;
    });
    this.allDisplayed[nextIndex].isActive = true;
  }

  @action _setActivePrev() {
    const prevIndex = this._wrapIndex(this.allDisplayed.findIndex(service => service.isActive), -1, this.allDisplayed.length);

    // TODO: simplify this;
    this.all.forEach((s, index) => {
      this.all[index].isActive = false;
    });
    this.allDisplayed[prevIndex].isActive = true;
  }

  @action _setUnreadMessageCount({ serviceId, count }) {
    const service = this.one(serviceId);

    service.unreadDirectMessageCount = count.direct;
    service.unreadIndirectMessageCount = count.indirect;
  }

  @action _setWebviewReference({ serviceId, webview }) {
    const service = this.one(serviceId);

    service.webview = webview;

    if (!service.isAttached) {
      debug('Webview is not attached, initializing');
      service.initializeWebViewEvents({
        handleIPCMessage: this.actions.service.handleIPCMessage,
        openWindow: this.actions.service.openWindow,
        stores: this.stores,
      });
      service.initializeWebViewListener();
    }

    service.isAttached = true;
  }

  @action _detachService({ service }) {
    service.webview = null;
    service.isAttached = false;
  }

  @action _focusService({ serviceId }) {
    const service = this.one(serviceId);

    if (service.webview) {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      service.webview.focus();
    }
  }

  @action _focusActiveService() {
    if (this.stores.user.isLoggedIn) {
      // TODO: add checks to not focus service when router path is /settings or /auth
      const service = this.active;
      if (service) {
        this._focusService({ serviceId: service.id });
      }
    } else {
      this.allServicesRequest.invalidate();
    }
  }

  @action _toggleService({ serviceId }) {
    const service = this.one(serviceId);

    service.isEnabled = !service.isEnabled;
  }

  @action _handleIPCMessage({ serviceId, channel, args }) {
    const service = this.one(serviceId);

    if (channel === 'hello') {
      debug('Received hello event from', serviceId);

      this._initRecipePolling(service.id);
      this._initializeServiceRecipeInWebview(serviceId);
      this._shareSettingsWithServiceProcess();
    } else if (channel === 'alive') {
      service.lastPollAnswer = Date.now();
    } else if (channel === 'messages') {
      debug(`Received unread message info from '${serviceId}'`, args[0]);

      this.actions.service.setUnreadMessageCount({
        serviceId,
        count: {
          direct: args[0].direct,
          indirect: args[0].indirect,
        },
      });
    } else if (channel === 'notification') {
      const options = args[0].options;
      if (service.recipe.hasNotificationSound || service.isMuted || this.stores.settings.all.app.isAppMuted) {
        Object.assign(options, {
          silent: true,
        });
      }

      if (service.isNotificationEnabled) {
        const title = typeof args[0].title === 'string' ? args[0].title : service.name;
        options.body = typeof options.body === 'string' ? options.body : '';

        this.actions.app.notify({
          notificationId: args[0].notificationId,
          title,
          options,
          serviceId,
        });
      }
    } else if (channel === 'avatar') {
      const url = args[0];
      if (service.iconUrl !== url && !service.hasCustomUploadedIcon) {
        service.customIconUrl = url;

        this.actions.service.updateService({
          serviceId,
          serviceData: {
            customIconUrl: url,
          },
          redirect: false,
        });
      }
    } else if (channel === 'new-window') {
      const url = args[0];

      this.actions.app.openExternalUrl({ url });
    } else if (channel === 'set-service-spellchecker-language') {
      if (!args) {
        console.warn('Did not receive locale');
      } else {
        this.actions.service.updateService({
          serviceId,
          serviceData: {
            spellcheckerLanguage: args[0] === 'reset' ? '' : args[0],
          },
          redirect: false,
        });
      }
    } else if (channel === 'feature:todos') {
      Object.assign(args[0].data, { serviceId });
      this.actions.todos.handleHostMessage(args[0]);
    }
  }

  @action _sendIPCMessage({ serviceId, channel, args }) {
    const service = this.one(serviceId);

    if (service.webview) {
      service.webview.send(channel, toJS(args));
    }
  }

  @action _sendIPCMessageToAllServices({ channel, args }) {
    this.all.forEach(s => this.actions.service.sendIPCMessage({
      serviceId: s.id,
      channel,
      args,
    }));
  }

  @action _openWindow({ event }) {
    if (event.disposition !== 'new-window' && event.url !== 'about:blank') {
      this.actions.app.openExternalUrl({ url: event.url });
    }
  }

  @action _filter({ needle }) {
    this.filterNeedle = needle;
  }

  @action _resetFilter() {
    this.filterNeedle = null;
  }

  @action _resetStatus() {
    this.actionStatus = [];
  }

  @action _reload({ serviceId }) {
    const service = this.one(serviceId);
    if (!service.isEnabled) return;

    service.resetMessageCount();
    service.lostRecipeConnection = false;

    if (service.recipe.id === TODOS_RECIPE_ID) {
      return this.actions.todos.reload();
    }

    return service.webview.loadURL(service.url);
  }

  @action _reloadActive() {
    if (this.active) {
      const service = this.one(this.active.id);

      this._reload({
        serviceId: service.id,
      });
    }
  }

  @action _reloadAll() {
    this.enabled.forEach(s => this._reload({
      serviceId: s.id,
    }));
  }

  @action _reloadUpdatedServices() {
    this._reloadAll();
    this.actions.ui.toggleServiceUpdatedInfoBar({ visible: false });
  }

  @action _reorder(params) {
    const { workspaces } = this.stores;
    if (workspaces.isAnyWorkspaceActive) {
      workspaces.reorderServicesOfActiveWorkspace(params);
    } else {
      this._reorderService(params);
    }
  }

  @action _reorderService({ oldIndex, newIndex }) {
    const showDisabledServices = this.stores.settings.all.app.showDisabledServices;
    const oldEnabledSortIndex = showDisabledServices ? oldIndex : this.all.indexOf(this.enabled[oldIndex]);
    const newEnabledSortIndex = showDisabledServices ? newIndex : this.all.indexOf(this.enabled[newIndex]);

    this.all.splice(newEnabledSortIndex, 0, this.all.splice(oldEnabledSortIndex, 1)[0]);

    const services = {};
    this.all.forEach((s, index) => {
      services[this.all[index].id] = index;
    });

    this.reorderServicesRequest.execute(services);
    this.allServicesRequest.patch((data) => {
      data.forEach((s) => {
        const service = s;

        service.order = services[s.id];
      });
    });

    this._reorderAnalytics();
  }

  @action _toggleNotifications({ serviceId }) {
    const service = this.one(serviceId);

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isNotificationEnabled: !service.isNotificationEnabled,
      },
      redirect: false,
    });
  }

  @action _toggleAudio({ serviceId }) {
    const service = this.one(serviceId);

    service.isNotificationEnabled = !service.isNotificationEnabled;

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isMuted: !service.isMuted,
      },
      redirect: false,
    });
  }

  @action _openDevTools({ serviceId }) {
    const service = this.one(serviceId);
    if (service.recipe.id === TODOS_RECIPE_ID) {
      this.actions.todos.openDevTools();
    } else {
      service.webview.openDevTools();
    }
  }

  @action _openDevToolsForActiveService() {
    const service = this.active;

    if (service) {
      this._openDevTools({ serviceId: service.id });
    } else {
      debug('No service is active');
    }
  }

  @action _hibernate({ serviceId }) {
    const service = this.one(serviceId);
    if (service.isActive || !service.isHibernationEnabled) {
      debug('Skipping service hibernation');
      return;
    }

    debug(`Hibernate ${service.name}`);

    service.isHibernating = true;
  }

  @action _awake({ serviceId }) {
    const service = this.one(serviceId);
    service.isHibernating = false;
    service.liveFrom = Date.now();
  }

  @action _resetLastPollTimer({ serviceId = null }) {
    debug(`Reset last poll timer for ${serviceId ? `service: "${serviceId}"` : 'all services'}`);

    const resetTimer = (service) => {
      service.lastPollAnswer = Date.now();
      service.lastPoll = Date.now();
    };

    if (!serviceId) {
      this.allDisplayed.forEach(service => resetTimer(service));
    } else {
      const service = this.one(serviceId);
      if (service) {
        resetTimer(service);
      }
    }
  }

  // Reactions
  _focusServiceReaction() {
    const service = this.active;
    if (service) {
      this.actions.service.focusService({ serviceId: service.id });
    }
  }

  _saveActiveService() {
    const service = this.active;

    if (service) {
      this.actions.settings.update({
        type: 'service',
        data: {
          activeService: service.id,
        },
      });
    }
  }

  _mapActiveServiceToServiceModelReaction() {
    const { activeService } = this.stores.settings.all.service;
    if (this.allDisplayed.length) {
      this.allDisplayed.map(service => Object.assign(service, {
        isActive: activeService ? activeService === service.id : this.allDisplayed[0].id === service.id,
      }));
    }
  }

  _getUnreadMessageCountReaction() {
    const showMessageBadgeWhenMuted = this.stores.settings.all.app.showMessageBadgeWhenMuted;
    const showMessageBadgesEvenWhenMuted = this.stores.ui.showMessageBadgesEvenWhenMuted;

    const unreadDirectMessageCount = this.allDisplayed
      .filter(s => (showMessageBadgeWhenMuted || s.isNotificationEnabled) && showMessageBadgesEvenWhenMuted && s.isBadgeEnabled)
      .map(s => s.unreadDirectMessageCount)
      .reduce((a, b) => a + b, 0);

    const unreadIndirectMessageCount = this.allDisplayed
      .filter(s => (showMessageBadgeWhenMuted && showMessageBadgesEvenWhenMuted) && (s.isBadgeEnabled && s.isIndirectMessageBadgeEnabled))
      .map(s => s.unreadIndirectMessageCount)
      .reduce((a, b) => a + b, 0);

    // We can't just block this earlier, otherwise the mobx reaction won't be aware of the vars to watch in some cases
    if (showMessageBadgesEvenWhenMuted) {
      this.actions.app.setBadge({
        unreadDirectMessageCount,
        unreadIndirectMessageCount,
      });
    }
  }

  _logoutReaction() {
    if (!this.stores.user.isLoggedIn) {
      this.actions.settings.remove({
        type: 'service',
        key: 'activeService',
      });
      this.allServicesRequest.invalidate().reset();
    }
  }

  _handleMuteSettings() {
    const { enabled } = this;
    const { isAppMuted } = this.stores.settings.app;

    enabled.forEach((service) => {
      const { isAttached } = service;
      const isMuted = isAppMuted || service.isMuted;

      if (isAttached) {
        service.webview.audioMuted = isMuted;
      }
    });
  }

  _shareSettingsWithServiceProcess() {
    const settings = this.stores.settings.app;
    this.actions.service.sendIPCMessageToAllServices({
      channel: 'settings-update',
      args: settings,
    });
  }

  _cleanUpTeamIdAndCustomUrl(recipeId, data) {
    const serviceData = data;
    const recipe = this.stores.recipes.one(recipeId);

    if (!recipe) return;

    if (recipe.hasTeamId && recipe.hasCustomUrl && data.team && data.customUrl) {
      delete serviceData.team;
    }

    return serviceData;
  }

  _restrictServiceAccess() {
    const { features } = this.stores.features;
    const { userHasReachedServiceLimit, serviceLimit } = this.stores.serviceLimit;

    this.all.map((service, index) => {
      if (userHasReachedServiceLimit) {
        service.isServiceAccessRestricted = index >= serviceLimit;

        if (service.isServiceAccessRestricted) {
          service.restrictionType = RESTRICTION_TYPES.SERVICE_LIMIT;

          debug('Restricting access to server due to service limit');
        }
      }

      if (service.isUsingCustomUrl) {
        service.isServiceAccessRestricted = !features.isCustomUrlIncludedInCurrentPlan;

        if (service.isServiceAccessRestricted) {
          service.restrictionType = RESTRICTION_TYPES.CUSTOM_URL;

          debug('Restricting access to server due to custom url');
        }
      }

      return service;
    });
  }

  _checkForActiveService() {
    if (this.stores.router.location.pathname.includes('auth/signup')) {
      return;
    }

    if (this.allDisplayed.findIndex(service => service.isActive) === -1 && this.allDisplayed.length !== 0) {
      debug('No active service found, setting active service to index 0');

      this._setActive({ serviceId: this.allDisplayed[0].id });
    }
  }

  // Helper
  _initializeServiceRecipeInWebview(serviceId) {
    const service = this.one(serviceId);

    if (service.webview) {
      debug('Initialize recipe', service.recipe.id, service.name);
      service.webview.send('initialize-recipe', Object.assign({
        franzVersion: app.getVersion(),
      }, service.shareWithWebview), service.recipe);
    }
  }

  _initRecipePolling(serviceId) {
    const service = this.one(serviceId);

    const delay = ms('2s');

    if (service) {
      if (service.timer !== null) {
        clearTimeout(service.timer);
      }

      const loop = () => {
        if (!service.webview) return;

        service.webview.send('poll');

        service.timer = setTimeout(loop, delay);
        service.lastPoll = Date.now();
      };

      loop();
    }
  }

  _reorderAnalytics = debounce(() => {
    gaEvent('Service', 'order');
  }, ms('5s'));

  _wrapIndex(index, delta, size) {
    return (((index + delta) % size) + size) % size;
  }
}
