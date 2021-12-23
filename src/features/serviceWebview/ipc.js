import { ipcMain, webContents, Menu } from 'electron';
import {
  INITIALIZE_SERVICE_WEBVIEW, REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, SERVICE_SPELLCHECKING_LANGUAGE, UPDATE_SPELLCHECKING_LANGUAGE,
} from './config';
import { buildMenuTpl } from './menu';

const debug = require('debug')('Franz:ipcApi:serviceWebview');

export default async ({ settings: { app: settings } }) => {
  ipcMain.handle(INITIALIZE_SERVICE_WEBVIEW, async (event, { id, serviceId }) => {
    try {
      const webviewWebContents = webContents.fromId(id);
      let spellcheckerLanguage = settings.get('spellcheckerLanguage');

      webviewWebContents.on('context-menu', async (e, props) => {
        debug('huhu');
        ipcMain.once(SERVICE_SPELLCHECKING_LANGUAGE, (requestLocaleEvent, { locale }) => {
          if (locale) {
            debug('Overwriting spellchecker locale to', locale);
            spellcheckerLanguage = locale;
          }

          debug('spellchecker language', spellcheckerLanguage);
          debug('default spellchecker language', settings.get('spellcheckerLanguage'));

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
                webContents: webviewWebContents,
                props,
                suggestions,
                isSpellcheckEnabled: settings.get('enableSpellchecking'),
                defaultSpellcheckerLanguage: settings.get('spellcheckerLanguage'),
                spellcheckerLanguage,
                onUpdateSpellcheckerLanguage: (data) => {
                  if (data === 'reset') {
                    debug('Resetting locale');
                    spellcheckerLanguage = settings.get('spellcheckerLanguage');
                  } else {
                    spellcheckerLanguage = data;
                  }

                  event.sender.send(UPDATE_SPELLCHECKING_LANGUAGE, { serviceId, locale: spellcheckerLanguage });
                },
              },
            ),
          );

          menu.popup();
        });
        event.sender.send(REQUEST_SERVICE_SPELLCHECKING_LANGUAGE, { serviceId });
      });
    } catch (e) {
      console.error(e);
    }
  });
};
