import { remote, shell } from 'electron';
import { autorun, computed, observable, toJS } from 'mobx';

import { isMac } from '../environment';

const { app, Menu, dialog } = remote;

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
        label: 'Copy',
        accelerator: 'Cmd+C',
        selector: 'copy:',
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
        label: 'Show Main Window',
        click() { app.mainWindow.show(); },
      },
      {
        type: 'separator',
      },
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
      {
        label: 'Changelog',
        click() { shell.openExternal('https://github.com/meetfranz/franz/blob/master/CHANGELOG.md'); },
      },
      {
        type: 'separator',
      },
      {
        label: 'Support',
        click() { shell.openExternal('http://meetfranz.com/support'); },
      },
      {
        type: 'separator',
      },
      {
        label: 'Terms of Service',
        click() { shell.openExternal('https://meetfranz.com/terms'); },
      },
      {
        label: 'Privacy Statement',
        click() { shell.openExternal('https://meetfranz.com/privacy'); },
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

    tpl[1].submenu.push({
      role: 'toggledevtools',
      click: () => {
        app.mainWindow.show();
      },
    }, {
      label: 'Toggle Service Developer Tools',
      accelerator: 'CmdOrCtrl+Shift+Alt+i',
      click: () => {
        app.mainWindow.show();

        this.actions.service.openDevToolsForActiveService();
      },
    });

    tpl[1].submenu.unshift({
      label: 'Reload Service',
      id: 'reloadService',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        app.mainWindow.show();

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
        app.mainWindow.show();

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
              app.mainWindow.show();

              this.actions.ui.openSettings({ path: 'app' });
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
    } else {
      tpl[4].submenu.unshift({
        role: 'about',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'Franz',
            message: 'Franz',
            detail: `Version: ${remote.app.getVersion()}\nRelease: ${process.versions.electron} / ${process.platform} / ${process.arch}`,
          });
        },
      });
    }

    const serviceTpl = this.serviceTpl;

    serviceTpl.unshift({
      label: 'Add new Service',
      accelerator: 'CmdOrCtrl+N',
      click: () => {
        app.mainWindow.show();

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
    const services = this.stores.services.allDisplayed;

    if (this.stores.user.isLoggedIn) {
      return services.map((service, i) => ({
        label: this._getServiceName(service),
        accelerator: i <= 9 ? `CmdOrCtrl+${i + 1}` : null,
        type: 'radio',
        checked: service.isActive,
        click: () => {
          app.mainWindow.show();

          this.actions.service.setActive({ serviceId: service.id });
        },
      }));
    }

    return [];
  }

  _getServiceName(service) {
    if (service.name) {
      return service.name;
    }

    let name = service.recipe.name;

    if (service.team) {
      name = `${name} (${service.team})`;
    } else if (service.customUrl) {
      name = `${name} (${service.customUrl})`;
    }

    return name;
  }
}
