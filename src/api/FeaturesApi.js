export default class FeaturesApi {
  constructor(server) {
    this.server = server;
  }

  base() {
    return this.server.getBaseFeatures();
  }

  features() {
    return this.server.getFeatures();
  }
}
