const { ipcRenderer } = require('electron');
const uuidV1 = require('uuid/v1');
// const FranzNotificationStore = [];

class Notification {
  constructor(title = '', options = {}) {
    this.title = title;
    this.options = options;
    this.notificationId = uuidV1();
    this.onclick = () => {};

    ipcRenderer.sendToHost('notification', {
      notificationId: this.notificationId,
      title,
      options,
    });

    ipcRenderer.on(`notification-onclick:${this.notificationId}`, () => {
      this.onclick();
    });
  }
}

Notification.permission = 'granted';

Notification.requestPermission = (cb = null) => {
  console.log(this);
  if (!cb) {
    return new Promise((resolve) => {
      resolve(Notification.permission);
    });
  }

  if (typeof (cb) === 'function') {
    return cb(Notification.permission);
  }

  return Notification.permission;
};

Notification.close = () => {
  // no implementation yet
};

window.Notification = Notification;
