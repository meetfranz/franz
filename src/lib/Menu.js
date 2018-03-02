import { remote, shell } from 'electron';
import { observable, autorun, computed } from 'mobx';
import { defineMessages } from 'react-intl';

import { isMac, ctrlKey, cmdKey } from '../environment';

const { app, Menu, dialog } = remote;

const menuItems = defineMessages({
  edit: {
    id: 'menu.edit',
    defaultMessage: '!!!Edit',
  },
});

function getActiveWebview() {
  return window.franz.stores.services.active.webview;
}

const _templateFactory = intl => [
  {
    label: intl.formatMessage(menuItems.edit),
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
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:',
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

const _titleBarTemplateFactory = intl => [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: `${ctrlKey}+Z`,
        click() {
          getActiveWebview().undo();
        },
      },
      {
        label: 'Redo',
        accelerator: `${ctrlKey}+Y`,
        click() {
          getActiveWebview().redo();
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: `${ctrlKey}+X`,
        click() {
          getActiveWebview().cut();
        },
      },
      {
        label: 'Copy',
        accelerator: `${ctrlKey}+C`,
        click() {
          getActiveWebview().copy();
        },
      },
      {
        label: 'Paste',
        accelerator: `${ctrlKey}+V`,
        click() {
          getActiveWebview().paste();
        },
      },
      {
        label: 'Paste and Match Style',
        accelerator: `${ctrlKey}+Shift+V`,
        click() {
          getActiveWebview().pasteAndMatchStyle();
        },
      },
      {
        label: 'Delete',
        click() {
          getActiveWebview().delete();
        },
      },
      {
        label: 'Select All',
        accelerator: `${ctrlKey}+A`,
        click() {
          getActiveWebview().selectAll();
        },
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
        label: 'Reset Zoom',
        accelerator: `${ctrlKey}+0`,
        click() {
          getActiveWebview().setZoomLevel(0);
        },
      },
      {
        label: 'Zoom in',
        accelerator: `${ctrlKey}+=`,
        click() {
          getActiveWebview().getZoomLevel((zoomLevel) => {
            getActiveWebview().setZoomLevel(zoomLevel === 5 ? zoomLevel : zoomLevel + 1);
          });
        },
      },
      {
        label: 'Zoom out',
        accelerator: `${ctrlKey}+-`,
        click() {
          getActiveWebview().getZoomLevel((zoomLevel) => {
            getActiveWebview().setZoomLevel(zoomLevel === -5 ? zoomLevel : zoomLevel - 1);
          });
        },
      },
    ],
  },
  {
    label: 'Services',
    submenu: [],
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Alt+M',
        click(menuItem, browserWindow) {
          browserWindow.minimize();
        },
      },
      {
        label: 'Close',
        accelerator: 'Alt+W',
        click(menuItem, browserWindow) {
          browserWindow.close();
        },
      },
    ],
  },
  {
    label: '?',
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
  @observable currentTemplate = [];

  constructor(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    autorun(this._build.bind(this));
  }

  rebuild() {
    this._build();
  }

  get template() {
    return this.currentTemplate.toJS();
  }

  _build() {
    // console.log(window.franz);
    const serviceTpl = Object.assign([], this.serviceTpl); // need to clone object so we don't modify computed (cached) object

    if (window.franz === undefined) {
      return;
    }

    const intl = window.franz.intl;
    const tpl = isMac ? _templateFactory(intl) : _titleBarTemplateFactory(intl);

    tpl[1].submenu.push({
      type: 'separator',
    }, {
      label: 'Toggle Developer Tools',
      accelerator: `${cmdKey}+Alt+I`,
      click: (menuItem, browserWindow) => {
        browserWindow.webContents.toggleDevTools();
      },
    }, {
      label: 'Open Service Developer Tools',
      accelerator: `${cmdKey}+Shift+Alt+I`,
      click: () => {
        this.actions.service.openDevToolsForActiveService();
      },
    });

    tpl[1].submenu.unshift({
      label: 'Reload Service',
      id: 'reloadService',
      accelerator: `${cmdKey}+R`,
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
      accelerator: `${cmdKey}+Shift+R`,
      click: () => {
        window.location.reload();
      },
    });

    tpl.unshift({
      label: isMac ? app.getName() : 'File',
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

    const about = {
      label: 'About Franz',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Franz',
          message: 'Franz',
          detail: `Version: ${remote.app.getVersion()}\nRelease: ${process.versions.electron} / ${process.platform} / ${process.arch}`,
        });
      },
    };

    if (isMac) {
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

      tpl[4].submenu.unshift(about, {
        type: 'separator',
      });
    } else {
      tpl[0].submenu = [
        {
          label: 'Preferences...',
          accelerator: 'Ctrl+P',
          click: () => {
            this.actions.ui.openSettings({ path: 'app' });
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Alt+F4',
          click: () => {
            app.quit();
          },
        },
      ];

      tpl[5].submenu.push({
        type: 'separator',
      }, about);
    }

    serviceTpl.unshift({
      label: 'Add new Service',
      accelerator: `${cmdKey}+N`,
      click: () => {
        this.actions.ui.openSettings({ path: 'recipes' });
      },
    }, {
      type: 'separator',
    });

    if (serviceTpl.length > 0) {
      tpl[3].submenu = serviceTpl;
    }

    this.currentTemplate = tpl;
    const menu = Menu.buildFromTemplate(tpl);
    Menu.setApplicationMenu(menu);
  }

  @computed get serviceTpl() {
    const services = this.stores.services.allDisplayed;

    if (this.stores.user.isLoggedIn) {
      return services.map((service, i) => ({
        label: this._getServiceName(service),
        accelerator: i <= 9 ? `${cmdKey}+${i + 1}` : null,
        type: 'radio',
        checked: service.isActive,
        click: () => {
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
