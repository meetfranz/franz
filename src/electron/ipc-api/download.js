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
    // We're passing a fake browserWindow to `electron-dl` in order to access the
    // webContents of the webview that has initiated the download
    const fakeWindow = {
      webContents: event.sender.webContents,
    };

    try {
      if (!content) {
        const dl = await download(fakeWindow, url, {
          saveAs: true,
        });
        debug('File saved to', dl.savePath);
      } else {
        const extension = mime.extension(fileOptions.mime);
        const filename = `${fileOptions.name}.${extension}`;

        try {
          const saveDialog = await dialog.showSaveDialog(params.mainWindow, {
            defaultPath: filename,
          });

          if (saveDialog.canceled) return;

          const binaryImage = decodeBase64Image(content);
          fs.writeFileSync(saveDialog.filePath, binaryImage, 'binary');

          debug('File blob saved to', saveDialog.filePath);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
};
