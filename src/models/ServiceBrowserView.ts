import {
  BrowserView, BrowserWindow, ipcMain, Menu,
} from 'electron';
import ms from 'ms';
import { REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, SERVICE_SPELLCHECKING_LANGUAGE, UPDATE_SPELLCHECKING_LANGUAGE } from '../features/serviceWebview/config';
import Settings from '../electron/Settings';
import { TAB_BAR_WIDTH } from '../config';
import Recipe from './Recipe';
import { buildMenuTpl } from '../electron/serviceContextMenuTemplate';

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
  settings: Settings
}

export class ServiceBrowserView {
  config: IServiceConfig;

  state: IServiceState;

  recipe: Recipe;

  view: BrowserView;

  window: BrowserWindow;

  settings: Settings;

  pollInterval: NodeJS.Timeout | undefined;

  constructor({
    config, state, recipe, window, settings,
  }: IServiceBrowserViewConstructor) {
    debug('Creating ServiceBrowserView Model', config);

    this.config = config;
    this.state = state;
    this.recipe = recipe;
    this.window = window;
    this.settings = settings;

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
      // debug('ipc message from', this.config.name, channel, data);
      this.window.webContents.send(channel, this.config.id, data);
    });

    this.view.webContents.send('initialize-recipe', this.state, this.recipe);

    this.pollInterval = setInterval(this.pollMessageLoop.bind(this), ms('2s'));

    this.enableContextMenu();
  }

  remove() {
    clearInterval(this.pollInterval);

    this.window.removeBrowserView(this.view);
  }

  pollMessageLoop() {
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

        // webviewWebContents.session.setSpellCheckerLanguages([settings.spellcheckerLanguage]);

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

  get webContents() {
    return this.view.webContents;
  }
}
