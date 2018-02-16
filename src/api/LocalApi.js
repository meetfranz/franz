export default class LocalApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  getAppCacheSize() {
    return this.local.getAppCacheSize();
  }

  clearAppCache() {
    return this.local.clearAppCache();
  }
}
