import { ipcRenderer } from 'electron';
import uuidV1 from 'uuid/v1';

const debug = require('debug')('Franz:Notifications');

class Notification {
  static permission = 'granted';

  constructor(title = '', options = {}) {
    debug('New notification', title, options);
    this.title = title;
    this.options = options;
    this.notificationId = uuidV1();

    ipcRenderer.sendToHost('notification', this.onNotify({
      title: this.title,
      options: this.options,
      notificationId: this.notificationId,
    }));

    ipcRenderer.once(`notification-onclick:${this.notificationId}`, () => {
      if (typeof this.onclick === 'function') {
        this.onclick();
      }
    });
  }

  static requestPermission(cb = null) {
    if (!cb) {
      return new Promise((resolve) => {
        resolve(Notification.permission);
      });
    }

    if (typeof (cb) === 'function') {
      return cb(Notification.permission);
    }

    return Notification.permission;
  }

  onNotify(data) {
    return data;
  }

  onClick() {}

  close() {}
}

window.Notification = Notification;
