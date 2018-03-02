import { observable, autorun } from 'mobx';

export default class ServiceGroup {
  id = '';

  @observable name = '';
  @observable unreadDirectMessageCount = 0;
  @observable unreadIndirectMessageCount = 0;

  @observable order = 99;
  @observable isEnabled = true;
  @observable isMuted = false;
  @observable isNotificationEnabled = true;
  @observable isBadgeEnabled = true;
  @observable isIndirectMessageBadgeEnabled = true;

  constructor(data) {
    if (!data) {
      console.error('Service config not valid');
      return null;
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;

    this.order = data.order !== undefined
      ? data.order : this.order;

    this.isEnabled = data.isEnabled !== undefined
      ? data.isEnabled : this.isEnabled;

    this.isNotificationEnabled = data.isNotificationEnabled !== undefined
      ? data.isNotificationEnabled : this.isNotificationEnabled;

    this.isBadgeEnabled = data.isBadgeEnabled !== undefined
      ? data.isBadgeEnabled : this.isBadgeEnabled;

    this.isIndirectMessageBadgeEnabled = data.isIndirectMessageBadgeEnabled !== undefined
      ? data.isIndirectMessageBadgeEnabled : this.isIndirectMessageBadgeEnabled;

    this.isMuted = data.isMuted !== undefined ? data.isMuted : this.isMuted;


    autorun(() => {
      if (!this.isEnabled) {
        this.unreadDirectMessageCount = 0;
        this.unreadIndirectMessageCount = 0;
      }
    });
  }

  resetMessageCount() {
    this.unreadDirectMessageCount = 0;
    this.unreadIndirectMessageCount = 0;
  }
}
