import { observable, extendObservable } from 'mobx';
import { DEFAULT_APP_SETTINGS } from '../config';

export default class Settings {
  @observable app = DEFAULT_APP_SETTINGS

  @observable proxy = {}

  @observable service = {
    activeService: '',
  }

  @observable stats = {
    appStarts: 0,
  }

  @observable migration = {}

  constructor({ app, proxy, service, stats, migration }) {
    Object.assign(this.app, app);
    Object.assign(this.proxy, proxy);
    Object.assign(this.service, service);
    Object.assign(this.stats, stats);
    Object.assign(this.migration, migration);
  }

  update(data) {
    extendObservable(this, data);
  }
}
