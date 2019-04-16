import { observable } from 'mobx';

export default class Workspace {
  id = null;

  @observable name = null;

  @observable order = null;

  @observable services = [];

  @observable userId = null;

  constructor(data) {
    if (!data.id) {
      throw Error('Workspace requires Id');
    }

    this.id = data.id;
    this.name = data.name;
    this.order = data.order;
    this.services.replace(data.services);
    this.userId = data.userId;
  }
}
