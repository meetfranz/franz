import {
  BrowserView, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, Rectangle, shell,
} from 'electron';
import ms from 'ms';
import { TAB_BAR_WIDTH, TODOS_RECIPE_ID } from '../config';
import { DEFAULT_APP_SETTINGS_VANILLA } from '../configVanilla';
import { buildMenuTpl } from '../electron/serviceContextMenuTemplate';
import Settings from '../electron/Settings';
import { isMac } from '../environment';
import { IPC } from '../features/todos/constants';
import { getRecipeDirectory, loadRecipeConfig } from '../helpers/recipe-helpers';
import { isValidExternalURL } from '../helpers/url-helpers';
import userAgent from '../helpers/userAgent-helpers';
import {
  REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, SERVICE_SPELLCHECKING_LANGUAGE, UPDATE_SERVICE_STATE, UPDATE_SPELLCHECKING_LANGUAGE,
} from '../ipcChannels';
import RecipeModel from './Recipe';

const debug = require('debug')('Franz:Models:ServiceBrowserView');

interface IServiceState {
  isActive: boolean,
  isSpellcheckerEnabled: boolean;
  spellcheckerLanguage: string,
  isDarkModeEnabled: boolean,
  team: string,
  hasCustomIcon: boolean,
  isRestricted: boolean;
  isHibernating: boolean;
}

interface IServiceConfig {
  id: string;
  name: string,
  url: string,
  partition: string,
}

interface IWebContentsState {
  isLoading: boolean;
  isFirstLoad: boolean;
  isError: boolean;
  errorMessage?: string;
  hasCrashed: boolean;
}

interface IServiceBrowserViewConstructor {
  config: IServiceConfig;
  state: IServiceState,
  recipeId: string,
  window: BrowserWindow,
  settings: Settings
}


export class ServiceBrowserView {
  config: IServiceConfig;

  state: IServiceState;

  recipeId: string;

  recipe: any;

  view: BrowserView = null;

  window: BrowserWindow;

  settings: Settings;

  pollInterval: NodeJS.Timeout | undefined;

  isAttached = false;

  bounds: Electron.Rectangle;

  webContentsState: IWebContentsState = {
    isLoading: true,
    isFirstLoad: true,
    isError: false,
    errorMessage: null,
    hasCrashed: false,
  };

  constructor({
    config, state, recipeId, window, settings,
  }: IServiceBrowserViewConstructor) {
    debug('Creating ServiceBrowserView Model', config);

    this.config = config;
    this.state = state;
    this.recipeId = recipeId;
    this.window = window;
    this.settings = settings;


    // eslint-disable-next-line import/no-dynamic-require, global-require
    const Recipe = require(getRecipeDirectory(this.recipeId))(RecipeModel);
    this.recipe = new Recipe(loadRecipeConfig(this.recipeId));

    if (!state.isRestricted) {
      this.view = new BrowserView({
        webPreferences: {
          partition: config.partition,
          preload: recipeId !== TODOS_RECIPE_ID ? `${__dirname}/../webview/recipe.js` : `${__dirname}/../features/todos/preload.js`,
          contextIsolation: false,
          spellcheck: this.state.isSpellcheckerEnabled,
          sandbox: false,
        },
      });
    }

    if (typeof this.recipe.modifyRequestHeaders === 'function') {
      this.enableModifyRequestHeaders();
    }

    if (typeof this.recipe.knownCertificateHosts === 'function') {
      this.enableKnownCertificateHosts();
    }

    if (typeof this.recipe.overrideUserAgent === 'function') {
      const ua = this.recipe.overrideUserAgent();

      this.webContents.setUserAgent(ua);
    }

    if (typeof this.recipe.onHeadersReceived === 'function') {
      this.enableOnHeadersReceived();
    }
  }

  attach() {
    if (this.isAttached) {
      debug('View is already attached', this.config.name);
      return;
    }

    if (!this.isRestricted) {
      const bounds = this.window.getBounds();

      if (!this.bounds) {
        this.bounds = {
          x: TAB_BAR_WIDTH, y: 0, width: bounds.width - TAB_BAR_WIDTH, height: bounds.height,
        };
      }

      this.window.addBrowserView(this.view);
      this.view.setBounds(this.bounds);
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
      this.webContents.on('ipc-message', (e, channel, data) => {
        this.window.webContents.send(channel, this.config.id, data);

        if (channel === 'hello') {
          this.webContents.send('initialize-recipe', this.state, this.recipe);
        }
      });

      this.webContents.on('did-start-loading', () => {
        debug('Did start load', this.config.name);

        this.setWebContentsState({
          hasCrashed: false,
          isLoading: true,
          isError: false,
        });

        if (typeof this.recipe.eventDidStartLoading === 'function') {
          this.recipe.eventDidStartLoading(this);
        }
      });

      const didLoad = (isMainFrame: boolean) => {
        if (!isMainFrame) return null;
        // add a timeout to avoid confusion due to layout flickering
        setTimeout(() => {
          this.setWebContentsState({
            isLoading: false,
            isFirstLoad: !!this.webContentsState.isError,
          });
        }, 500);
      };

      this.webContents.on('did-frame-finish-load', (...args) => {
        const [, isMainFrame] = args;
        didLoad(isMainFrame);

        if (typeof this.recipe.eventDidFrameFinishLoad === 'function') {
          this.recipe.eventDidFrameFinishLoad(this, ...args);
        }
      });

      this.webContents.on('did-fail-load', (...args) => {
        const [, errorCode, errorDescription, , isMainFrame] = args;
        debug('Service failed to load', this.config.name);
        if (isMainFrame && errorCode !== -21 && errorCode !== -3) {
          this.setWebContentsState({
            isError: true,
            errorMessage: errorDescription,
            isLoading: false,
          });
        }

        if (typeof this.recipe.eventDidFailLoad === 'function') {
          this.recipe.eventDidFailLoad(this, ...args);
        }
      });

      this.webContents.on('did-finish-load', (...args) => {
        if (typeof this.recipe.eventDidFinishLoad === 'function') {
          this.recipe.eventDidFinishLoad(this, ...args);
        }
      });

      this.webContents.on('will-navigate', (...args) => {
        this.gmailLoginHack(args[1]);

        if (typeof this.recipe.eventWillNavigate === 'function') {
          this.recipe.eventWillNavigate(this, ...args);
        }
      });

      this.webContents.on('did-navigate', (...args) => {
        didLoad(true);

        this.gmailLoginHack(args[1]);

        if (typeof this.recipe.eventDidLoad === 'function') {
          this.recipe.eventDidLoad(this, ...args);
        }
      });

      this.webContents.setWindowOpenHandler(({
        url, disposition, ...rest
      }) => {
        debug('trying to open new-window with url', url, disposition, rest);

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

          if (isValidExternalURL(url)) {
            shell.openExternal(url);
          }
        }

        return {
          action,
          overrideBrowserWindowOptions,
        };
      });

      this.pollInterval = setInterval(this.pollLoop.bind(this), ms('2s'));

      if (this.isTodos) {
        debug('init todos web contents', new Date());
        this.window.webContents.send(IPC.TODOS_HOST_CHANNEL, { action: 'setWebContentsId', id: this.webContents.id });
      }

      this.enableContextMenu();
      this.hacks();

      this.webContents.loadURL(this.config.url);
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

    const { isSpellcheckerEnabled, spellcheckerLanguage } = this.state;

    this.webContents.session.setSpellCheckerEnabled(this.state.isSpellcheckerEnabled);

    if (isSpellcheckerEnabled) {
      this.webContents.session.setSpellCheckerLanguages([spellcheckerLanguage || DEFAULT_APP_SETTINGS_VANILLA.spellcheckerLanguage]);
    }
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

      debug(this.config.name, 'is service attached', this.isAttached);
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
              serviceId: this.config.id,
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
  }: Rectangle) {
    const bounds = this.view.getBounds();
    const newBounds = {
      width: parseInt((width ?? bounds.width).toFixed(), 10),
      height: parseInt((height ?? bounds.height).toFixed(), 10),
      x: parseInt((x ?? bounds.x).toFixed(), 10),
      y: parseInt((y ?? bounds.y).toFixed(), 10),
    };

    this.view.setBounds(newBounds);

    this.bounds = newBounds;
  }

  focus() {
    this.webContents.focus();
  }

  enableModifyRequestHeaders() {
    const modifiedRequestHeaders = this.recipe.modifyRequestHeaders();

    modifiedRequestHeaders.forEach((headerFilterSet) => {
      const { headers, requestFilters } = headerFilterSet;
      this.webContents.session.webRequest.onBeforeSendHeaders(requestFilters, (details, callback) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const key in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, key)) {
            const value = headers[key];
            if (value === 'RefererHost') {
              if (Object.prototype.hasOwnProperty.call(details.requestHeaders, 'Referer')) {
                const { hostname } = new URL(details.requestHeaders.Referer);
                details.requestHeaders[key] = `https://${hostname}`;
              }
            } else {
              details.requestHeaders[key] = value;
            }
          }
        }
        callback({ requestHeaders: details.requestHeaders });
      });
    });
    //
  }

  enableKnownCertificateHosts() {
    const knownHosts = this.recipe.knownCertificateHosts();

    this.webContents.session.setCertificateVerifyProc((request, callback) => {
      const { hostname } = request;
      if (knownHosts.find(item => item.includes(hostname))) {
        callback(0);
      } else {
        callback(-3);
      }
    });
  }

  enableOnHeadersReceived() {
    this.webContents.session.webRequest.onHeadersReceived(
      (...args) => {
        this.recipe.onHeadersReceived(...args);
      },
    );
  }

  setWebContentsState(state: Partial<IWebContentsState>) {
    this.webContentsState = {
      ...this.webContentsState,
      ...state,
    };

    if (!this.window.isDestroyed()) {
      this.window.webContents.send(UPDATE_SERVICE_STATE, { serviceId: this.config.id, state: this.webContentsState });
    }
  }

  hacks() {
    this.webContents.insertCSS('html { background: white; } ');
    if (isMac) {
      this.webContents.insertCSS(`
        body:before {
          background: transparent;
          height: 30px;
          width: 100%;
          position: absolute;
          content: " ";
          z-index: 9999999;
          pointer-events: none;
          -webkit-app-region: drag;
        }
      `);
    }
  }

  gmailLoginHack(url) {
    if (url.startsWith('https://accounts.google.com')) {
      this.webContents.setUserAgent(userAgent(true));
    } else {
      this.webContents.setUserAgent(userAgent(false));
    }
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

  get isTodos() {
    return this.recipe.id === TODOS_RECIPE_ID;
  }
}
