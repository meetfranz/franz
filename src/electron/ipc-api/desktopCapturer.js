import { ipcMain, desktopCapturer } from 'electron';
import { REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY } from '../../features/desktopCapturer/config';

// const debug = require('debug')('Franz:ipcApi:desktopCapturer');

export default async () => {
  ipcMain.handle(REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY, async () => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
        fetchWindowIcons: true,
      });
      // debug('Available sources', sources);
      return sources.map((source) => {
        const thumbnail = source.thumbnail ? source.thumbnail.toDataURL() : null;
        const appIcon = source.appIcon ? source.appIcon.toDataURL() : null;

        return {
          id: source.id,
          name: source.name,
          displayId: source.display_id,
          thumbnail,
          appIcon,
        };
      });
    } catch (e) {
      console.error(e);
    }
  });
};
