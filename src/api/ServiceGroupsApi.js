export default class ServiceGroupsApi {
  constructor(server, local) {
    this.local = local;
    this.server = server;
  }

  all() {
    return this.server.getServiceGroups();
  }

  create(data) {
    return this.server.createServiceGroup(data);
  }

  delete(groupId) {
    return this.server.deleteServiceGroup(groupId);
  }

  update(groupId, data) {
    return this.server.updateServiceGroup(groupId, data);
  }

  reorder(data) {
    return this.server.reorderServiceGroup(data);
  }
}
