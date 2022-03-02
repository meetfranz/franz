import { BrowserView, BrowserWindow } from 'electron';
import ms = require('ms');
import { TAB_BAR_WIDTH } from '../config';
import Recipe from './Recipe';

const debug = require('debug')('Franz:Models:ServiceBrowserView');

interface IServiceState {
  isActive: boolean,
  spellcheckerLanguage: string,
  isDarkModeEnabled: boolean,
  team: string,
  hasCustomIcon: boolean,
}

interface IServiceConfig {
  id: string;
  name: string,
  url: string,
  partition: string,
}

interface IServiceBrowserViewConstructor {
  config: IServiceConfig;
  state: IServiceState,
  recipe: Recipe,
  window: BrowserWindow,
}

export class ServiceBrowserView {
  config: IServiceConfig;

  state: IServiceState;

  recipe: Recipe;

  view: BrowserView;

  window: BrowserWindow;

  pollInterval: NodeJS.Timeout | undefined;

  constructor({
    config, state, recipe, window,
  }: IServiceBrowserViewConstructor) {
    debug('Creating ServiceBrowserView Model', config);

    this.config = config;
    this.state = state;
    this.recipe = recipe;
    this.window = window;

    this.view = new BrowserView({
      webPreferences: {
        partition: config.partition,
        preload: `${__dirname}/../webview/recipe.js`,
        contextIsolation: false,
      },
    });
  }

  attach() {
    const bounds = this.window.getBounds();

    this.window.addBrowserView(this.view);
    this.view.setBounds({
      x: TAB_BAR_WIDTH, y: 0, width: bounds.width - TAB_BAR_WIDTH, height: bounds.height,
    });
    this.view.setAutoResize({
      width: true,
      height: true,
    });
    this.view.setBackgroundColor('black');

    this.view.webContents.loadURL(this.config.url);

    this.view.webContents.on('ipc-message', (e, channel, data) => {
      debug('ipc message from', this.config.name, channel, data);
    });

    this.view.webContents.send('initialize-recipe', this.state, this.recipe);

    this.pollInterval = setInterval(this.pollMessageLoop.bind(this), ms('2s'));
  }

  remove() {
    clearInterval(this.pollInterval);

    this.window.removeBrowserView(this.view);
  }

  pollMessageLoop() {
    this.view.webContents.send('poll', this.state, this.recipe);
  }


  get webContents() {
    return this.view.webContents;
  }
}
