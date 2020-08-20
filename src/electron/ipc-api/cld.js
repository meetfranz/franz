import { ipcMain } from 'electron';
import { loadModule } from 'cld3-asm';

const debug = require('debug')('Franz:ipcApi:cld');

export default async () => {
  const cldFactory = await loadModule();
  const cldIdentifier = cldFactory.create(0, 1000);

  ipcMain.on('detect-language', async (event, { sample }) => {
    // console.log(event);
    try {
      const findResult = cldIdentifier.findLanguage(sample);
      debug('Checking language', 'probability', findResult.probability);
      if (findResult.is_reliable) {
        debug('Language detected reliably, setting spellchecker language to', findResult.language);
        event.sender.webContents.send('detected-language', { locale: findResult.language });
      }
    } catch (e) {
      console.error(e);
    }
  });
};
