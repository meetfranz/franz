import { observable, computed, action } from 'mobx';
import moment from 'moment';
import jwt from 'jsonwebtoken';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { gaEvent } from '../lib/analytics';

// TODO: split stores into UserStore and AuthStore
export default class UserStore extends Store {
  BASE_ROUTE = '/auth';
  WELCOME_ROUTE = `${this.BASE_ROUTE}/welcome`;
  LOGIN_ROUTE = `${this.BASE_ROUTE}/login`;
  LOGOUT_ROUTE = `${this.BASE_ROUTE}/logout`;
  SIGNUP_ROUTE = `${this.BASE_ROUTE}/signup`;
  PRICING_ROUTE = `${this.BASE_ROUTE}/signup/pricing`;
  IMPORT_ROUTE = `${this.BASE_ROUTE}/signup/import`;
  INVITE_ROUTE = `${this.BASE_ROUTE}/signup/invite`;
  PASSWORD_ROUTE = `${this.BASE_ROUTE}/password`;

  @observable loginRequest = new Request(this.api.user, 'login');
  @observable signupRequest = new Request(this.api.user, 'signup');
  @observable passwordRequest = new Request(this.api.user, 'password');
  @observable inviteRequest = new Request(this.api.user, 'invite');
  @observable getUserInfoRequest = new CachedRequest(this.api.user, 'getInfo');
  @observable updateUserInfoRequest = new Request(this.api.user, 'updateInfo');
  @observable getLegacyServicesRequest = new CachedRequest(this.api.user, 'getLegacyServices');
  @observable deleteAccountRequest = new CachedRequest(this.api.user, 'delete');

  @observable isImportLegacyServicesExecuting = false;
  @observable isImportLegacyServicesCompleted = false;

  @observable id;
  @observable authToken = localStorage.getItem('authToken') || null;
  @observable accountType;

  @observable hasCompletedSignup = null;

  @observable userData = {};

  @observable actionStatus = [];

  logoutReasonTypes = {
    SERVER: 'SERVER',
  };
  @observable logoutReason = null;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.user.login.listen(this._login.bind(this));
    this.actions.user.retrievePassword.listen(this._retrievePassword.bind(this));
    this.actions.user.logout.listen(this._logout.bind(this));
    this.actions.user.signup.listen(this._signup.bind(this));
    this.actions.user.invite.listen(this._invite.bind(this));
    this.actions.user.update.listen(this._update.bind(this));
    this.actions.user.resetStatus.listen(this._resetStatus.bind(this));
    this.actions.user.importLegacyServices.listen(this._importLegacyServices.bind(this));
    this.actions.user.delete.listen(this._delete.bind(this));

    // Reactions
    this.registerReactions([
      this._requireAuthenticatedUser,
      this._getUserData.bind(this),
    ]);
  }

  // Routes
  get loginRoute() {
    return this.LOGIN_ROUTE;
  }

  get logoutRoute() {
    return this.LOGOUT_ROUTE;
  }

  get signupRoute() {
    return this.SIGNUP_ROUTE;
  }

  get pricingRoute() {
    return this.PRICING_ROUTE;
  }

  get inviteRoute() {
    return this.INVITE_ROUTE;
  }

  get importRoute() {
    return this.IMPORT_ROUTE;
  }

  get passwordRoute() {
    return this.PASSWORD_ROUTE;
  }

  // Data
  @computed get isLoggedIn() {
    return this.authToken !== null && this.authToken !== undefined;
  }

  // @computed get isTokenValid() {
  //   return this.authToken !== null && moment(this.tokenExpiry).isAfter(moment());
  // }

  @computed get isTokenExpired() {
    if (!this.authToken) return false;

    const { tokenExpiry } = this._parseToken(this.authToken);
    return this.authToken !== null && moment(tokenExpiry).isBefore(moment());
  }

  @computed get data() {
    this.getUserInfoRequest.execute();
    return this.getUserInfoRequest.result || {};
  }

  @computed get legacyServices() {
    this.getLegacyServicesRequest.execute();
    return this.getLegacyServicesRequest.result || [];
  }

  // Actions
  @action async _login({ email, password }) {
    const authToken = await this.loginRequest.execute(email, password)._promise;
    this._setUserData(authToken);

    this.stores.router.push('/');

    gaEvent('User', 'login');
  }

  @action async _signup({ firstname, lastname, email, password, accountType, company }) {
    const authToken = await this.signupRequest.execute({
      firstname,
      lastname,
      email,
      password,
      accountType,
      company,
    });

    this.hasCompletedSignup = false;

    this._setUserData(authToken);

    this.stores.router.push(this.PRICING_ROUTE);

    gaEvent('User', 'signup');
  }

  @action async _retrievePassword({ email }) {
    const request = this.passwordRequest.execute(email);

    await request._promise;
    this.actionStatus = request.result.status || [];

    gaEvent('User', 'retrievePassword');
  }

  @action _invite({ invites }) {
    const data = invites.filter(invite => invite.email !== '');

    this.inviteRequest.execute(data);

    // we do not wait for a server response before redirecting the user
    this.stores.router.push('/');

    gaEvent('User', 'inviteUsers');
  }

  @action async _update({ userData }) {
    const response = await this.updateUserInfoRequest.execute(userData)._promise;

    this.getUserInfoRequest.patch(() => response.data);
    this.actionStatus = response.status || [];

    gaEvent('User', 'update');
  }

  @action _resetStatus() {
    this.actionStatus = [];
  }

  @action _logout() {
    localStorage.removeItem('authToken');
    this.getUserInfoRequest.invalidate().reset();
    this.authToken = null;
    // this.data = {};
  }

  @action async _importLegacyServices({ services }) {
    this.isImportLegacyServicesExecuting = true;

    // Reduces recipe duplicates
    const recipes = services.filter((obj, pos, arr) => arr.map(mapObj => mapObj.recipe.id).indexOf(obj.recipe.id) === pos).map(s => s.recipe.id);

    // Install recipes
    for (const recipe of recipes) {
      // eslint-disable-next-line
      await this.stores.recipes._install({ recipeId: recipe });
    }

    for (const service of services) {
      this.actions.service.createFromLegacyService({
        data: service,
      });
      await this.stores.services.createServiceRequest._promise; // eslint-disable-line
    }

    this.isImportLegacyServicesExecuting = false;
    this.isImportLegacyServicesCompleted = true;
  }

  @action async _delete() {
    this.deleteAccountRequest.execute();
  }

  // This is a mobx autorun which forces the user to login if not authenticated
  _requireAuthenticatedUser = () => {
    if (this.isTokenExpired) {
      this._logout();
    }

    const { router } = this.stores;
    const currentRoute = router.location.pathname;
    if (!this.isLoggedIn
      && !currentRoute.includes(this.BASE_ROUTE)) {
      router.push(this.WELCOME_ROUTE);
    } else if (this.isLoggedIn
      && currentRoute === this.LOGOUT_ROUTE) {
      this.actions.user.logout();
      router.push(this.LOGIN_ROUTE);
    } else if (this.isLoggedIn
      && currentRoute.includes(this.BASE_ROUTE)
      && (this.hasCompletedSignup
        || this.hasCompletedSignup === null)) {
      this.stores.router.push('/');
    }
  };

  // Reactions
  async _getUserData() {
    if (this.isLoggedIn) {
      const data = await this.getUserInfoRequest.execute()._promise;

      // We need to set the beta flag for the SettingsStore
      this.actions.settings.update({
        settings: {
          beta: data.beta,
        },
      });
    }
  }

  // Helpers
  _parseToken(authToken) {
    try {
      const decoded = jwt.decode(authToken);

      return ({
        id: decoded.userId,
        tokenExpiry: moment.unix(decoded.exp).toISOString(),
        authToken,
      });
    } catch (err) {
      console.error('AccessToken Invalid');

      return false;
    }
  }

  _setUserData(authToken) {
    const data = this._parseToken(authToken);
    if (data.authToken) {
      localStorage.setItem('authToken', data.authToken);

      this.authToken = data.authToken;
      this.id = data.id;
    } else {
      this.authToken = null;
      this.id = null;
    }
  }
}
