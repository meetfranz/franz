import { observable } from 'mobx';

export default class User {
  id = null;

  @observable email = null;

  @observable firstname = null;

  @observable lastname = null;

  @observable organization = null;

  @observable accountType = null;

  @observable emailIsConfirmed = true;

  // better assume it's confirmed to avoid noise
  @observable subscription = {};

  @observable isSubscriptionOwner = false;

  @observable isPremium = false;

  @observable beta = false;

  @observable donor = {};

  @observable isDonor = false;

  @observable isMiner = false;

  @observable locale = false;

  constructor(data) {
    if (!data.id) {
      throw Error('User requires Id');
    }

    this.id = data.id;
    this.email = data.email || this.email;
    this.firstname = data.firstname || this.firstname;
    this.lastname = data.lastname || this.lastname;
    this.organization = data.organization || this.organization;
    this.accountType = data.accountType || this.accountType;
    this.isPremium = data.isPremium || this.isPremium;
    this.beta = data.beta || this.beta;
    this.donor = data.donor || this.donor;
    this.isDonor = data.isDonor || this.isDonor;
    this.isSubscriptionOwner = data.isSubscriptionOwner || this.isSubscriptionOwner;
    this.isMiner = data.isMiner || this.isMiner;
    this.locale = data.locale || this.locale;
  }
}
