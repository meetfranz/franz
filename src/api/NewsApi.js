export default class NewsApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  latest() {
    return this.server.getLatestNews();
  }

  hide(id) {
    return this.server.hideNews(id);
  }
}
