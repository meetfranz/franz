// This is heavily based on https://github.com/sindresorhus/electron-context-menu
// ❤ @sindresorhus

import { clipboard, remote, ipcRenderer, shell } from 'electron';

import { isDevMode } from '../environment';

const debug = require('debug')('Franz:contextMenu');

const { Menu } = remote;

// const win = remote.getCurrentWindow();
const webContents = remote.getCurrentWebContents();

function delUnusedElements(menuTpl) {
  let notDeletedPrevEl;
  return menuTpl.filter(el => el.visible !== false).filter((el, i, array) => {
    const toDelete = el.type === 'separator' && (!notDeletedPrevEl || i === array.length - 1 || array[i + 1].type === 'separator');
    notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
    return !toDelete;
  });
}

const buildMenuTpl = (props, suggestions) => {
  const { editFlags } = props;
  const hasText = props.selectionText.trim().length > 0;
  const can = type => editFlags[`can${type}`] && hasText;

  console.log(props);

  let menuTpl = [
    {
      type: 'separator',
    }, {
      id: 'cut',
      role: can('Cut') ? 'cut' : '',
      enabled: can('Cut'),
      visible: props.selectionText.trim(),
    }, {
      id: 'copy',
      label: 'Copy',
      role: can('Copy') ? 'copy' : '',
      enabled: can('Copy'),
      visible: props.isEditable || hasText,
    }, {
      id: 'paste',
      label: 'Paste',
      role: editFlags.canPaste ? 'paste' : '',
      enabled: editFlags.canPaste,
      visible: props.isEditable,
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
        shell.openExternal(props.srcURL);
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

            ipcRenderer.send('download-file', {
              content: base64data,
              fileOptions: {
                name: fileName,
                mime: blob.type,
              },
            });
          };
          debug('binary string', blob);
        } else {
          ipcRenderer.send('download-file', { url: props.srcURL });
        }
      },
    }, {
      type: 'separator',
    });
  }

  console.log('suggestions', suggestions.length, suggestions);
  if (suggestions.length > 0) {
    suggestions.reverse().map(suggestion => menuTpl.unshift({
      id: `suggestion-${suggestion}`,
      label: suggestion,
      click() {
        webContents.replaceMisspelling(suggestion);
      },
    }));
  }

  if (isDevMode) {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'inspect',
      label: 'Inspect Element',
      click() {
        webContents.inspectElement(props.x, props.y);
      },
    }, {
      type: 'separator',
    });
  }

  return delUnusedElements(menuTpl);
};

export default function contextMenu(spellcheckProvider) {
  webContents.on('context-menu', (e, props) => {
    e.preventDefault();

    let suggestions = [];
    if (spellcheckProvider && props.misspelledWord) {
      suggestions = spellcheckProvider.getSuggestion(props.misspelledWord);

      debug('Suggestions', suggestions);
    }

    const menu = Menu.buildFromTemplate(buildMenuTpl(props, suggestions.slice(0, 5)));

    menu.popup(remote.getCurrentWindow());
  });
}
