import { remote, shell } from 'electron';
import { autorun, computed, observable, toJS } from 'mobx';

import { isDevMode, isMac } from '../environment';

const { app, Menu } = remote;

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'pasteandmatchstyle',
      },
      {
        role: 'delete',
      },
      {
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        type: 'separator',
      },
      {
        role: 'resetzoom',
      },
      {
        role: 'zoomin',
        accelerator: 'CommandOrControl+=',
      },
      {
        role: 'zoomout',
      },
      {
        type: 'separator',
      },
      {
        role: 'togglefullscreen',
      },
    ],
  },
  {
    label: 'Services',
    submenu: [],
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize',
      },
      {
        role: 'close',
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal('http://meetfranz.com'); },
      },
    ],
  },
];

export default class FranzMenu {
  @observable tpl = template;

  constructor(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    autorun(this._build.bind(this));
  }

  _build() {
    const tpl = toJS(this.tpl);

    if (isDevMode) {
      tpl[1].submenu.push({
        role: 'toggledevtools',
      }, {
        label: 'Toggle Service Developer Tools',
        accelerator: 'CmdOrCtrl+Shift+Alt+i',
        click: () => {
          this.actions.service.openDevToolsForActiveService();
        },
      });
    }

    tpl[1].submenu.unshift({
      label: 'Reload Service',
      id: 'reloadService',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        if (this.stores.user.isLoggedIn
          && this.stores.services.enabled.length > 0) {
          this.actions.service.reloadActive();
        } else {
          window.location.reload();
        }
      },
    }, {
      label: 'Reload Franz',
      accelerator: 'CmdOrCtrl+Shift+R',
      click: () => {
        window.location.reload();
      },
    });

    if (isMac) {
      tpl.unshift({
        label: app.getName(),
        submenu: [
          {
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.actions.ui.openSettings({ path: '' });
            },
          },
          {
            type: 'separator',
          },
          {
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            role: 'hide',
          },
          {
            role: 'hideothers',
          },
          {
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            role: 'quit',
          },
        ],
      });
      // Edit menu.
      tpl[1].submenu.push(
        {
          type: 'separator',
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking',
            },
            {
              role: 'stopspeaking',
            },
          ],
        },
      );
      // Window menu.
      tpl[3].submenu = [
        {
          // label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
        {
          // label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          // label: 'Zoom',
          role: 'zoom',
        },
        {
          type: 'separator',
        },
        {
          // label: 'Bring All to Front',
          role: 'front',
        },
      ];
    }

    const serviceTpl = this.serviceTpl;

    serviceTpl.unshift({
      label: 'Add new Service',
      accelerator: 'CmdOrCtrl+N',
      click: () => {
        this.actions.ui.openSettings({ path: 'recipes' });
      },
    }, {
      type: 'separator',
    });

    if (serviceTpl.length > 0) {
      tpl[isMac ? 3 : 2].submenu = toJS(this.serviceTpl);
    }

    const menu = Menu.buildFromTemplate(tpl);
    Menu.setApplicationMenu(menu);
  }

  @computed get serviceTpl() {
    const services = this.stores.services.enabled;

    if (this.stores.user.isLoggedIn) {
      return services.map((service, i) => ({
        label: service.name,
        accelerator: i <= 9 ? `CmdOrCtrl+${i + 1}` : null,
        type: 'radio',
        checked: service.isActive,
        click: () => {
          this.actions.service.setActive({ serviceId: service.id });
        },
      }));
    }

    return [];
  }
}
