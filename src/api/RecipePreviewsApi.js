export default class ServicesApi {
  constructor(server) {
    this.server = server;
  }

  all() {
    return this.server.getRecipePreviews();
  }

  featured() {
    return this.server.getFeaturedRecipePreviews();
  }

  search(needle) {
    return this.server.searchRecipePreviews(needle);
  }
}
