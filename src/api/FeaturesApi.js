export default class FeaturesApi {
  constructor(server) {
    this.server = server;
  }

  defaults() {
    return this.server.getDefaultFeatures();
  }
}
