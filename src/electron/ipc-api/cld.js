import { loadModule } from 'cld3-asm';
import { ipcMain } from 'electron';

const debug = require('debug')('Franz:ipcApi:cld');

export default async () => {
  const cldFactory = await loadModule();
  const cld = cldFactory.create(0, 1000);
  ipcMain.handle('detect-language', async (event, { sample }) => {
    try {
      const result = cld.findLanguage(sample);
      debug('Checking language', result.language);
      if (result.is_reliable) {
        debug('Language detected reliably, setting spellchecker language to', result.language);

        return result.language;
      }
    } catch (e) {
      console.error(e);
    }
  });
};
