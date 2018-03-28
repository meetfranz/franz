import { observable, extendObservable } from 'mobx';
import { DEFAULT_APP_SETTINGS } from '../config';

export default class Settings {
  @observable app = DEFAULT_APP_SETTINGS

  @observable service = {
    activeService: '',
  }

  @observable group = {
    collapsed: [],
    disabled: [],
  }

  @observable stats = {
    appStarts: 0,
  }

  @observable migration = {}

  constructor({ app, service, group, stats, migration }) {
    Object.assign(this.app, app);
    Object.assign(this.service, service);
    Object.assign(this.group, group);
    Object.assign(this.stats, stats);
    Object.assign(this.migration, migration);
  }

  update(data) {
    extendObservable(this, data);
  }
}
