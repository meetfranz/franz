import { dialog, WebContents } from 'electron';
import { download } from 'electron-dl';
import fs from 'fs-extra';
import mime from 'mime-types';

const debug = require('debug')('Franz:ipcApi:download');

function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  return Buffer.from(matches[2], 'base64');
}

type Params = {
  url?: string;
  content?: string | ArrayBuffer;
  webContents: WebContents;
  fileOptions?: {
    mime: string;
    name: string;
  };
}
// export default (params) => {
export async function downloadFile({
  url,
  content,
  webContents,
  fileOptions,
}: Params) {
  // We're passing a fake browserWindow to `electron-dl` in order to access the
  // webContents of the webview that has initiated the download
  const fakeWindow = {
    webContents,
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
        const saveDialog = await dialog.showSaveDialog(null, {
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
}
