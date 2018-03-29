export default class LocalApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  getAppSettings() {
    return this.local.getAppSettings();
  }

  updateAppSettings(data) {
    return this.local.updateAppSettings(data);
  }

  getAppCacheSize() {
    return this.local.getAppCacheSize();
  }

  clearAppCache() {
    return this.local.clearAppCache();
  }
}
