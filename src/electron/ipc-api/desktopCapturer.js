import { ipcMain, desktopCapturer, webContents } from 'electron';
import { RELAY_DESKTOP_CAPTURER_SOURCES_IPC_KEY, REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY, SET_DESKTOP_CAPTURER_SOURCES_IPC_KEY } from '../../features/desktopCapturer/config';

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

  ipcMain.on(RELAY_DESKTOP_CAPTURER_SOURCES_IPC_KEY, (event, { webContentsId, sourceId }) => {
    const contents = webContents.fromId(webContentsId);
    contents.send(SET_DESKTOP_CAPTURER_SOURCES_IPC_KEY, { sourceId });
  });
};
