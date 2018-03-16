import { observable, autorun } from 'mobx';

export default class ServiceGroup {
  id = '';

  @observable name = '';
  @observable order = 99;

  services = [];

  constructor(data) {
    if (!data) {
      console.error('Service config not valid');
      return null;
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;

    this.order = data.order !== undefined
      ? data.order : this.order;
  }
}
