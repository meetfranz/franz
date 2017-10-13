import { remote } from 'electron';
import { autorun } from 'mobx';

import { isMac } from '../environment';

export default class FranzTouchBar {
  constructor(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    this._initializeReactions();
  }

  _initializeReactions() {
    this.build = autorun(this._build.bind(this));
  }

  _build() {
    const currentWindow = remote.getCurrentWindow();

    if (isMac && this.stores.user.isLoggedIn) {
      const { TouchBar } = remote;
      const { TouchBarButton, TouchBarSpacer } = TouchBar;

      const buttons = [];
      this.stores.services.enabled.forEach(((service) => {
        buttons.push(new TouchBarButton({
          label: `${service.name}${service.unreadDirectMessageCount > 0
            ? ' 🔴' : ''} ${service.unreadDirectMessageCount === 0
              && service.unreadIndirectMessageCount > 0
            ? ' ⚪️' : ''}`,
          backgroundColor: service.isActive ? '#3498DB' : null,
          click: () => {
            this.actions.service.setActive({ serviceId: service.id });
          },
        }), new TouchBarSpacer({ size: 'small' }));
      }));

      const touchBar = new TouchBar(buttons);
      currentWindow.setTouchBar(touchBar);
    } else {
      currentWindow.setTouchBar(null);
    }
  }
}
