export default class Settings {
  store = {};

  set(settings) {
    this.store = Object.assign(this.store, settings);
  }

  all() {
    return this.store;
  }

  get(key) {
    return this.store[key];
  }
}
