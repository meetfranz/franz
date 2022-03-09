import {
  clipboard, nativeImage, shell, webContents,
} from 'electron';
import fetch from 'electron-fetch';
import { DEFAULT_WEB_CONTENTS_ID } from '../config';
import { isDevMode, isMac } from '../environment';
import { IPC } from '../features/todos/constants';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';

const debug = require('debug')('Franz:feature:serviceContextMenu');

function delUnusedElements(menuTpl) {
  let notDeletedPrevEl;
  return menuTpl.filter(el => el.visible !== false).filter((el, i, array) => {
    const toDelete = el.type === 'separator' && (!notDeletedPrevEl || i === array.length - 1 || array[i + 1].type === 'separator');
    notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
    return !toDelete;
  });
}

export const buildMenuTpl = ({
  serviceId, webContents: contents, props, suggestions, isSpellcheckEnabled, defaultSpellcheckerLanguage, spellcheckerLanguage, onUpdateSpellcheckerLanguage,
}) => {
  const { editFlags } = props;
  const textSelection = props.selectionText.trim();
  const hasText = textSelection.length > 0;
  const can = type => editFlags[`can${type}`] && hasText;

  const canGoBack = contents.canGoBack();
  const canGoForward = contents.canGoForward();

  let menuTpl = [
    {
      type: 'separator',
    }, {
      id: 'createTodo',
      label: `Create todo: "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: hasText,
      click() {
        debug('Create todo from selected text', textSelection);
        console.log('wc', contents.getURL());
        webContents.fromId(DEFAULT_WEB_CONTENTS_ID).send(IPC.TODOS_HOST_CHANNEL, {
          action: 'todos:create',
          data: {
            title: textSelection,
            url: contents.getURL(),
            serviceId,
          },
        });
      },
    },
    {
      type: 'separator',
    }, {
      id: 'lookup',
      label: `Look Up "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: isMac && props.mediaType === 'none' && hasText,
      click() {
        debug('Show definition for selection', textSelection);
        contents.showDefinitionForSelection();
      },
    }, {
      type: 'separator',
    }, {
      id: 'cut',
      label: 'Cut',
      click() {
        if (can('Cut')) {
          contents.cut();
        }
      },
      enabled: can('Cut'),
      visible: hasText && props.isEditable,
    }, {
      id: 'copy',
      label: 'Copy',
      click() {
        if (can('Copy')) {
          contents.copy();
        }
      },
      enabled: can('Copy'),
      visible: props.isEditable || hasText,
    }, {
      id: 'paste',
      label: 'Paste',
      click() {
        if (editFlags.canPaste) {
          contents.paste();
        }
      },
      enabled: editFlags.canPaste,
      visible: props.isEditable,
    }, {
      type: 'separator',
      visible: props.isEditable && hasText,
    }, {
      id: 'searchTextSelection',
      label: `Search Google for "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: hasText,
      click() {
        const url = `https://www.google.com/search?q=${textSelection}`;
        debug('Search on Google', url);
        shell.openExternal(url);
      },
    }, {
      type: 'separator',
    },
  ];

  if (props.linkURL && props.mediaType === 'none') {
    menuTpl = [{
      type: 'separator',
    }, {
      id: 'openLink',
      label: 'Open Link in Browser',
      click() {
        debug('Open link in Browser', props.linkURL);
        shell.openExternal(props.linkURL);
      },
    }, {
      id: 'copyLink',
      label: 'Copy Link',
      click() {
        clipboard.write({
          bookmark: props.linkText,
          text: props.linkURL,
        });
      },
    }, {
      type: 'separator',
    }];
  }

  if (props.mediaType === 'image') {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'openImage',
      label: 'Open Image in Browser',
      click() {
        debug('Open image in Browser', props.srcURL);
        shell.openExternal(props.srcURL);
      },
    }, {
      id: 'copyImage',
      label: 'Copy Image',
      click: async () => {
        try {
          const resp = await fetch(props.srcURL, {
            method: 'GET',
            session: contents.session,
          });

          const imageBuffer = await resp.buffer();
          const image = nativeImage.createFromBuffer(imageBuffer);

          clipboard.write({
            image,
          });
        } catch (e) {
          console.error(e);
        }
      },
    }, {
      id: 'copyImageAddress',
      label: 'Copy Image Address',
      click() {
        clipboard.write({
          bookmark: props.srcURL,
          text: props.srcURL,
        });
      },
    }, {
      type: 'separator',
    });
  }

  if (props.mediaType === 'image') {
    menuTpl.push({
      id: 'saveImageAs',
      label: 'Save Image As…',
      async click() {
        if (props.srcURL.startsWith('blob:')) {
          const url = new window.URL(props.srcURL.substr(5));
          const fileName = url.pathname.substr(1);
          const resp = await window.fetch(props.srcURL);
          const blob = await resp.blob();
          const reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;

            contents.send('download-file', {
              content: base64data,
              fileOptions: {
                name: fileName,
                mime: blob.type,
              },
            });
          };
          debug('binary string', blob);
        } else {
          contents.send('download-file', { url: props.srcURL });
        }
      },
    }, {
      type: 'separator',
    });
  }

  // Allow users to add the misspelled word to the dictionary
  if (props.misspelledWord) {
    menuTpl.unshift({
      type: 'separator',
    }, {
      label: `Add "${props.misspelledWord}" to dictionary`,
      click: () => contents.session.addWordToSpellCheckerDictionary(props.misspelledWord),
    });
  }

  if (suggestions.length > 0) {
    suggestions.reverse().map(suggestion => menuTpl.unshift({
      id: `suggestion-${suggestion}`,
      label: suggestion,
      click() {
        contents.replaceMisspelling(suggestion);
      },
    }));
  }

  if (canGoBack || canGoForward) {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'goBack',
      label: 'Go Back',
      enabled: canGoBack,
      click() {
        contents.goBack();
      },
    }, {
      id: 'goForward',
      label: 'Go Forward',
      enabled: canGoForward,
      click() {
        contents.goForward();
      },
    }, {
      type: 'separator',
    });
  }

  if (!isMac) {
    const spellcheckingLanguages = [];
    Object.keys(SPELLCHECKER_LOCALES).sort(Intl.Collator().compare).forEach((key) => {
      spellcheckingLanguages.push({
        id: `lang-${key}`,
        label: SPELLCHECKER_LOCALES[key],
        type: 'radio',
        checked: spellcheckerLanguage === key,
        click() {
          debug('Setting service spellchecker to', key);
          // webContents.send('set-service-spellchecker-language', key);
          onUpdateSpellcheckerLanguage(key);
        },
      });
    });

    menuTpl.push({
      type: 'separator',
    }, {
      id: 'spellchecker',
      label: 'Spell Checking',
      visible: isSpellcheckEnabled,
      submenu: [
        {
          id: 'spellchecker',
          label: 'Available Languages',
          enabled: false,
        }, {
          type: 'separator',
        },
        {
          id: 'resetToDefault',
          label: `Reset to system default (${defaultSpellcheckerLanguage === 'automatic' ? 'Automatic' : SPELLCHECKER_LOCALES[defaultSpellcheckerLanguage]})`,
          type: 'radio',
          visible: defaultSpellcheckerLanguage !== spellcheckerLanguage || (defaultSpellcheckerLanguage !== 'automatic' && spellcheckerLanguage === 'automatic'),
          click() {
            debug('Resetting service spellchecker to system default');
            contents.send('set-service-spellchecker-language', 'reset');
            onUpdateSpellcheckerLanguage('reset');
          },
        },
        {
          id: 'automaticDetection',
          label: 'Automatic language detection',
          type: 'radio',
          checked: spellcheckerLanguage === 'automatic',
          click() {
            debug('Detect language automatically');
            contents.send('set-service-spellchecker-language', 'automatic');
            onUpdateSpellcheckerLanguage('automatic');
          },
        },
        {
          type: 'separator',
          visible: defaultSpellcheckerLanguage !== spellcheckerLanguage,
        },
        ...spellcheckingLanguages],
    });
  }


  if (isDevMode) {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'inspect',
      label: 'Inspect Element',
      click() {
        contents.inspectElement(props.x, props.y);
      },
    });
  }

  return delUnusedElements(menuTpl);
};
