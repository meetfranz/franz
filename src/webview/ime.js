const { ipcRenderer } = require('electron');
const { claimDocumentFocus } = require('../helpers/webview-ime-focus-helpers');

ipcRenderer.on('claim-document-focus', claimDocumentFocus);

window.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[autofocus]')) {
    ipcRenderer.sendToHost('autofocus');
  }
});
