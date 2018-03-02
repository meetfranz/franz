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
  undo: {
    id: 'menu.edit.undo',
    defaultMessage: '!!!Undo',
  },
  redo: {
    id: 'menu.edit.redo',
    defaultMessage: '!!!Redo',
  },
  cut: {
    id: 'menu.edit.cut',
    defaultMessage: '!!!Cut',
  },
  copy: {
    id: 'menu.edit.copy',
    defaultMessage: '!!!Copy',
  },
  paste: {
    id: 'menu.edit.paste',
    defaultMessage: '!!!Paste',
  },
  pasteAndMatchStyle: {
    id: 'menu.edit.pasteAndMatchStyle',
    defaultMessage: '!!!Paste And Match Style',
  },
  delete: {
    id: 'menu.edit.delete',
    defaultMessage: '!!!Delete',
  },
  selectAll: {
    id: 'menu.edit.selectAll',
    defaultMessage: '!!!Select All',
  },
  speech: {
    id: 'menu.edit.speech',
    defaultMessage: '!!!Speech',
  },
  startSpeaking: {
    id: 'menu.edit.startSpeaking',
    defaultMessage: '!!!Start Speaking',
  },
  stopSpeaking: {
    id: 'menu.edit.stopSpeaking',
    defaultMessage: '!!!Stop Speaking',
  },
  startDictation: {
    id: 'menu.edit.startDictation',
    defaultMessage: '!!!Start Dictation',
  },
  emojiSymbols: {
    id: 'menu.edit.emojiSymbols',
    defaultMessage: '!!!Emoji & Symbols',
  },
  resetZoom: {
    id: 'menu.view.resetZoom',
    defaultMessage: '!!!Actual Size',
  },
  zoomIn: {
    id: 'menu.view.zoomIn',
    defaultMessage: '!!!Zoom In',
  },
  zoomOut: {
    id: 'menu.view.zoomOut',
    defaultMessage: '!!!Zoom Out',
  },
  enterFullScreen: {
    id: 'menu.view.enterFullScreen',
    defaultMessage: '!!!Enter Full Screen',
  },
  exitFullScreen: {
    id: 'menu.view.exitFullScreen',
    defaultMessage: '!!!Exit Full Screen',
  },
  toggleFullScreen: {
    id: 'menu.view.toggleFullScreen',
    defaultMessage: '!!!Toggle Full Screen',
  },
  toggleDevTools: {
    id: 'menu.view.toggleDevTools',
    defaultMessage: '!!!Toggle Developer Tools',
  },
  toggleServiceDevTools: {
    id: 'menu.view.toggleServiceDevTools',
    defaultMessage: '!!!Toggle Service Developer Tools',
  },
  reloadService: {
    id: 'menu.view.reloadService',
    defaultMessage: '!!!Reload Service',
  },
  reloadFranz: {
    id: 'menu.view.reloadFranz',
    defaultMessage: '!!!Reload Franz',
  },
  minimize: {
    id: 'menu.window.minimize',
    defaultMessage: '!!!Minimize',
  },
  close: {
    id: 'menu.window.close',
    defaultMessage: '!!!Close',
  },
  learnMore: {
    id: 'menu.help.learnMore',
    defaultMessage: '!!!Learn More',
  },
  changelog: {
    id: 'menu.help.changelog',
    defaultMessage: '!!!Changelog',
  },
  support: {
    id: 'menu.help.support',
    defaultMessage: '!!!Support',
  },
  tos: {
    id: 'menu.help.tos',
    defaultMessage: '!!!Terms of Service',
  },
  privacy: {
    id: 'menu.help.privacy',
    defaultMessage: '!!!Privacy Statement',
  },
  file: {
    id: 'menu.file',
    defaultMessage: '!!!File',
  },
  view: {
    id: 'menu.view',
    defaultMessage: '!!!View',
  },
  services: {
    id: 'menu.services',
    defaultMessage: '!!!Services',
  },
  window: {
    id: 'menu.window',
    defaultMessage: '!!!Window',
  },
  help: {
    id: 'menu.help',
    defaultMessage: '!!!Help',
  },
  about: {
    id: 'menu.app.about',
    defaultMessage: '!!!About Franz',
  },
  settings: {
    id: 'menu.app.settings',
    defaultMessage: '!!!Settings',
  },
  hide: {
    id: 'menu.app.hide',
    defaultMessage: '!!!Hide',
  },
  hideOthers: {
    id: 'menu.app.hideOthers',
    defaultMessage: '!!!Hide Others',
  },
  unhide: {
    id: 'menu.app.unhide',
    defaultMessage: '!!!Unhide',
  },
  quit: {
    id: 'menu.app.quit',
    defaultMessage: '!!!Quit',
  },
  addNewService: {
    id: 'menu.services.addNewService',
    defaultMessage: '!!!Add New Service...',
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
        label: intl.formatMessage(menuItems.undo),
        role: 'undo',
      },
      {
        label: intl.formatMessage(menuItems.redo),
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.cut),
        accelerator: 'Cmd+X',
        selector: 'cut:',
      },
      {
        label: intl.formatMessage(menuItems.copy),
        accelerator: 'Cmd+C',
        selector: 'copy:',
      },
      {
        label: intl.formatMessage(menuItems.paste),
        accelerator: 'Cmd+V',
        selector: 'paste:',
      },
      {
        label: intl.formatMessage(menuItems.pasteAndMatchStyle),
        accelerator: 'Cmd+Shift+V',
        selector: 'pasteAndMatchStyle:',
      },
      {
        label: intl.formatMessage(menuItems.delete),
        role: 'delete',
      },
      {
        label: intl.formatMessage(menuItems.selectAll),
        accelerator: 'Cmd+A',
        selector: 'selectAll:',
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.view),
    submenu: [
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.resetZoom),
        role: 'resetzoom',
      },
      {
        label: intl.formatMessage(menuItems.zoomIn),
        // accelerator: 'Cmd+=',
        role: 'zoomin',
      },
      {
        label: intl.formatMessage(menuItems.zoomOut),
        role: 'zoomout',
      },
      {
        type: 'separator',
      },
      {
        label: app.mainWindow.isFullScreen() // label doesn't work, gets overridden by Electron
          ? intl.formatMessage(menuItems.exitFullScreen)
          : intl.formatMessage(menuItems.enterFullScreen),
        role: 'togglefullscreen',
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.services),
    submenu: [],
  },
  {
    label: intl.formatMessage(menuItems.window),
    role: 'window',
    submenu: [
      {
        label: intl.formatMessage(menuItems.minimize),
        role: 'minimize',
      },
      {
        label: intl.formatMessage(menuItems.close),
        role: 'close',
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.help),
    role: 'help',
    submenu: [
      {
        label: intl.formatMessage(menuItems.learnMore),
        click() { shell.openExternal('http://meetfranz.com'); },
      },
      {
        label: intl.formatMessage(menuItems.changelog),
        click() { shell.openExternal('https://github.com/meetfranz/franz/blob/master/CHANGELOG.md'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.support),
        click() { shell.openExternal('http://meetfranz.com/support'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.tos),
        click() { shell.openExternal('https://meetfranz.com/terms'); },
      },
      {
        label: intl.formatMessage(menuItems.privacy),
        click() { shell.openExternal('https://meetfranz.com/privacy'); },
      },
    ],
  },
];

const _titleBarTemplateFactory = intl => [
  {
    label: intl.formatMessage(menuItems.edit),
    submenu: [
      {
        label: intl.formatMessage(menuItems.undo),
        accelerator: `${ctrlKey}+Z`,
        click() {
          getActiveWebview().undo();
        },
      },
      {
        label: intl.formatMessage(menuItems.redo),
        accelerator: `${ctrlKey}+Y`,
        click() {
          getActiveWebview().redo();
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.cut),
        accelerator: `${ctrlKey}+X`,
        click() {
          getActiveWebview().cut();
        },
      },
      {
        label: intl.formatMessage(menuItems.copy),
        accelerator: `${ctrlKey}+C`,
        click() {
          getActiveWebview().copy();
        },
      },
      {
        label: intl.formatMessage(menuItems.paste),
        accelerator: `${ctrlKey}+V`,
        click() {
          getActiveWebview().paste();
        },
      },
      {
        label: intl.formatMessage(menuItems.pasteAndMatchStyle),
        accelerator: `${ctrlKey}+Shift+V`,
        click() {
          getActiveWebview().pasteAndMatchStyle();
        },
      },
      {
        label: intl.formatMessage(menuItems.delete),
        click() {
          getActiveWebview().delete();
        },
      },
      {
        label: intl.formatMessage(menuItems.selectAll),
        accelerator: `${ctrlKey}+A`,
        click() {
          getActiveWebview().selectAll();
        },
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.view),
    submenu: [
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.resetZoom),
        accelerator: `${ctrlKey}+0`,
        click() {
          getActiveWebview().setZoomLevel(0);
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomIn),
        accelerator: `${ctrlKey}+Plus`,
        click() {
          getActiveWebview().getZoomLevel((zoomLevel) => {
            getActiveWebview().setZoomLevel(zoomLevel === 5 ? zoomLevel : zoomLevel + 1);
          });
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomOut),
        accelerator: `${ctrlKey}+-`,
        click() {
          getActiveWebview().getZoomLevel((zoomLevel) => {
            getActiveWebview().setZoomLevel(zoomLevel === -5 ? zoomLevel : zoomLevel - 1);
          });
        },
      },
      {
        type: 'separator',
      },
      {
        label: app.mainWindow.isFullScreen() // label doesn't work, gets overridden by Electron
          ? intl.formatMessage(menuItems.exitFullScreen)
          : intl.formatMessage(menuItems.enterFullScreen),
        accelerator: `${ctrlKey}+F`,
        click(menuItem, browserWindow) {
          browserWindow.setFullScreen(!browserWindow.isFullScreen());
        },
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.services),
    submenu: [],
  },
  {
    label: intl.formatMessage(menuItems.window),
    submenu: [
      {
        label: intl.formatMessage(menuItems.minimize),
        accelerator: 'Alt+M',
        click(menuItem, browserWindow) {
          browserWindow.minimize();
        },
      },
      {
        label: intl.formatMessage(menuItems.close),
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
        label: intl.formatMessage(menuItems.learnMore),
        click() { shell.openExternal('http://meetfranz.com'); },
      },
      {
        label: intl.formatMessage(menuItems.changelog),
        click() { shell.openExternal('https://github.com/meetfranz/franz/blob/master/CHANGELOG.md'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.support),
        click() { shell.openExternal('http://meetfranz.com/support'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.tos),
        click() { shell.openExternal('https://meetfranz.com/terms'); },
      },
      {
        label: intl.formatMessage(menuItems.privacy),
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
      label: intl.formatMessage(menuItems.toggleDevTools),
      accelerator: `${cmdKey}+Alt+I`,
      click: (menuItem, browserWindow) => {
        browserWindow.webContents.toggleDevTools();
      },
    }, {
      label: intl.formatMessage(menuItems.toggleServiceDevTools),
      accelerator: `${cmdKey}+Shift+Alt+I`,
      click: () => {
        this.actions.service.openDevToolsForActiveService();
      },
    });

    tpl[1].submenu.unshift({
      label: intl.formatMessage(menuItems.reloadService),
      id: 'reloadService', // TODO: needed?
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
      label: intl.formatMessage(menuItems.reloadFranz),
      accelerator: `${cmdKey}+Shift+R`,
      click: () => {
        window.location.reload();
      },
    });

    tpl.unshift({
      label: isMac ? app.getName() : intl.formatMessage(menuItems.file),
      submenu: [
        {
          label: intl.formatMessage(menuItems.about),
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.settings),
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            this.actions.ui.openSettings({ path: 'app' });
          },
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.services),
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.hide),
          role: 'hide',
        },
        {
          label: intl.formatMessage(menuItems.hideOthers),
          role: 'hideothers',
        },
        {
          label: intl.formatMessage(menuItems.unhide),
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.quit),
          role: 'quit',
        },
      ],
    });

    const about = {
      label: intl.formatMessage(menuItems.about),
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
          label: intl.formatMessage(menuItems.speech),
          submenu: [
            {
              label: intl.formatMessage(menuItems.startSpeaking),
              role: 'startspeaking',
            },
            {
              label: intl.formatMessage(menuItems.stopSpeaking),
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
          label: intl.formatMessage(menuItems.settings),
          accelerator: 'Ctrl+P',
          click: () => {
            this.actions.ui.openSettings({ path: 'app' });
          },
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.quit),
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
      label: intl.formatMessage(menuItems.addNewService),
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
