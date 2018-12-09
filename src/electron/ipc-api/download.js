import { ipcMain, dialog } from 'electron';
import { download } from 'electron-dl';
import mime from 'mime-types';
import fs from 'fs-extra';

const debug = require('debug')('Franz:ipcApi:download');

function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  return Buffer.from(matches[2], 'base64');
}

export default (params) => {
  ipcMain.on('download-file', async (event, { url, content, fileOptions = {} }) => {
    try {
      if (!content) {
        const dl = await download(params.mainWindow, url, {
          saveAs: true,
        });
        debug('File saved to', dl.getSavePath());
      } else {
        const extension = mime.extension(fileOptions.mime);
        const filename = `${fileOptions.name}.${extension}`;

        dialog.showSaveDialog(params.mainWindow, {
          defaultPath: filename,
        }, (name) => {
          const binaryImage = decodeBase64Image(content);
          fs.writeFileSync(name, binaryImage, 'binary');

          debug('File blob saved to', name);
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
};
