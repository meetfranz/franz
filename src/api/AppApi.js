export default class AppApi {
  constructor(server) {
    this.server = server;
  }

  health() {
    return this.server.healthCheck();
  }
}
