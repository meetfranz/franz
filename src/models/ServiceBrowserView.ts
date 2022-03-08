import {
  BrowserView, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, Rectangle, shell,
} from 'electron';
import ms from 'ms';
import { REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, SERVICE_SPELLCHECKING_LANGUAGE, UPDATE_SPELLCHECKING_LANGUAGE } from '../ipcChannels';
import Settings from '../electron/Settings';
import { TAB_BAR_WIDTH } from '../config';
import Recipe from './Recipe';
import { buildMenuTpl } from '../electron/serviceContextMenuTemplate';
import { sleep } from '../helpers/async-helpers';
import { easeInOutSine } from '../helpers/animation-helpers';

const debug = require('debug')('Franz:Models:ServiceBrowserView');

interface IServiceState {
  isActive: boolean,
  spellcheckerLanguage: string,
  isDarkModeEnabled: boolean,
  team: string,
  hasCustomIcon: boolean,
  isRestricted: boolean;
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
  settings: Settings
}

export class ServiceBrowserView {
  config: IServiceConfig;

  state: IServiceState;

  recipe: Recipe;

  view: BrowserView = null;

  window: BrowserWindow;

  settings: Settings;

  pollInterval: NodeJS.Timeout | undefined;

  isAttached = false;

  constructor({
    config, state, recipe, window, settings,
  }: IServiceBrowserViewConstructor) {
    debug('Creating ServiceBrowserView Model', config);

    this.config = config;
    this.state = state;
    this.recipe = recipe;
    this.window = window;
    this.settings = settings;

    if (!state.isRestricted) {
      this.view = new BrowserView({
        webPreferences: {
          partition: config.partition,
          preload: `${__dirname}/../webview/recipe.js`,
          contextIsolation: false,
        },
      });
    }
  }

  attach() {
    if (!this.isRestricted) {
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

      this.isAttached = true;
    }
  }

  initialize() {
    if (!this.isRestricted) {
      this.view.webContents.loadURL(this.config.url);

      this.view.webContents.on('ipc-message', (e, channel, data) => {
        // debug('ipc message from', this.config.name, channel, data);
        this.window.webContents.send(channel, this.config.id, data);
      });

      this.webContents.setWindowOpenHandler(({ url, disposition, ...rest }) => {
        debug('trying to open new-window with url', url, rest);

        let action: 'allow' | 'deny' = 'deny';
        let overrideBrowserWindowOptions: BrowserWindowConstructorOptions = {};

        if (disposition === 'new-window') {
          action = 'allow';

          overrideBrowserWindowOptions = {
            ...overrideBrowserWindowOptions,
            webPreferences: {
              partition: this.config.partition,
            },
          };
        } else if (disposition === 'background-tab' || disposition === 'foreground-tab') {
          action = 'deny';

          shell.openExternal(url);
        }

        return {
          action,
          overrideBrowserWindowOptions,
        };
      });

      this.view.webContents.send('initialize-recipe', this.state, this.recipe);

      this.pollInterval = setInterval(this.pollLoop.bind(this), ms('2s'));

      this.enableContextMenu();
    }
  }

  update({ config = {}, state = {} }: { config?: Partial<Pick<IServiceConfig, 'name' | 'url'>>, state?: Partial<IServiceState>}) {
    debug('Update service', this.config.name, 'config', config, 'state', state);
    if (config.url !== this.config.url) {
      debug('load url for service. old:', this.config.url, 'new', config.url);
      this.webContents.loadURL(config.url);
    }

    this.config = {
      ...this.config,
      ...config,
    };

    this.state = {
      ...this.state,
      ...state,
    };
  }

  remove() {
    if (this.isAttached) {
      this.window.removeBrowserView(this.view);
    }

    this.isAttached = false;
  }

  destroy() {
    if (this.webContents) {
      clearInterval(this.pollInterval);
      this.webContents.forcefullyCrashRenderer();
    }
  }

  setActive() {
    if (!this.isRestricted) {
      const browserWindowUrl = new URL(this.window.webContents.getURL());
      if (browserWindowUrl.hash.startsWith('#/settings')) {
        debug('Skip setting browserView active as settings window is open');
        return;
      }

      debug('is service attached', this.isAttached);
      if (!this.isAttached) {
        this.attach();
      }

      debug('Set browserView active', this.config.name);
      this.window.setTopBrowserView(this.view);
      this.webContents.focus();
    }
  }

  pollLoop() {
    this.view.webContents.send('poll', this.state, this.recipe);
  }

  enableContextMenu() {
    let spellcheckerLanguage = this.settings.get('spellcheckerLanguage');

    this.webContents.on('context-menu', async (e, props) => {
      debug('huhu');

      ipcMain.once(SERVICE_SPELLCHECKING_LANGUAGE, (requestLocaleEvent, { locale }) => {
        if (locale) {
          debug('Overwriting spellchecker locale to', locale);
          spellcheckerLanguage = locale;
        }

        debug('spellchecker language', spellcheckerLanguage);
        debug('default spellchecker language', this.settings.get('spellcheckerLanguage'));

        e.preventDefault();

        let suggestions = [];
        if (props.dictionarySuggestions) {
          suggestions = props.dictionarySuggestions;

          debug('Suggestions', suggestions);
        }

        const menu = Menu.buildFromTemplate(
          buildMenuTpl(
            {
              webContents: this.webContents,
              props,
              suggestions,
              isSpellcheckEnabled: this.settings.get('enableSpellchecking'),
              defaultSpellcheckerLanguage: this.settings.get('spellcheckerLanguage'),
              spellcheckerLanguage,
              onUpdateSpellcheckerLanguage: (data) => {
                if (data === 'reset') {
                  debug('Resetting locale');
                  spellcheckerLanguage = this.settings.get('spellcheckerLanguage');
                } else {
                  spellcheckerLanguage = data;
                }

                this.window.webContents.send(UPDATE_SPELLCHECKING_LANGUAGE, { serviceId: this.config.id, locale: spellcheckerLanguage });
              },
            },
          ),
        );

        menu.popup();
      });
      this.window.webContents.send(REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, { serviceId: this.config.id });
    });
  }

  async resize({
    width, height, x, y,
  }: Rectangle, animationDuration = 0) {
    if (!animationDuration) {
      const bounds = this.view.getBounds();
      const newBounds = {
        width: width ?? bounds.width,
        height: height ?? bounds.height,
        x: x ?? bounds.x,
        y: y ?? bounds.y,
      };

      this.view.setBounds(newBounds);
    } else {
      const bounds = this.view.getBounds();
      const change: Rectangle = {
        width: (width ?? bounds.width) - bounds.width,
        height: (height ?? bounds.height) - bounds.height,
        x: (x ?? bounds.x) - bounds.x,
        y: (y ?? bounds.y) - bounds.y,
      };
      for (let index = 0; index <= animationDuration; index += 1) {
        const newBounds = {
          width: parseInt(easeInOutSine(index, bounds.width, change.width, animationDuration).toString(), 10),
          height: parseInt(easeInOutSine(index, bounds.height, change.height, animationDuration).toString(), 10),
          x: parseInt(easeInOutSine(index, bounds.x, change.x, animationDuration).toString(), 10),
          y: parseInt(easeInOutSine(index, bounds.y, change.y, animationDuration).toString(), 10),
        };

        // eslint-disable-next-line no-await-in-loop
        await sleep(1);

        this.view.setBounds(newBounds);
      }
    }
  }


  focus() {
    this.webContents.focus();
  }

  get webContents() {
    return this.view.webContents;
  }

  get isActive() {
    return this.state.isActive;
  }

  get isRestricted() {
    return this.state.isRestricted;
  }
}
