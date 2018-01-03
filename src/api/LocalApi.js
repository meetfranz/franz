export default class LocalApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  getSettings() {
    return this.local.getAppSettings();
  }

  updateSettings(data) {
    return this.local.updateAppSettings(data);
  }

  removeKey(key) {
    return this.local.removeKey(key);
  }

  getAppCacheSize() {
    return this.local.getAppCacheSize();
  }

  clearAppCache() {
    return this.local.clearAppCache();
  }
}
