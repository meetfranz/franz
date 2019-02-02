export default class FeaturesApi {
  constructor(server) {
    this.server = server;
  }

  default() {
    return this.server.getDefaultFeatures();
  }

  features() {
    return this.server.getFeatures();
  }
}
