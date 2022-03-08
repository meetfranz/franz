import { ipcRenderer } from 'electron';
import { SET_DESKTOP_CAPTURER_SOURCES_IPC_KEY } from '../features/desktopCapturer/config';
import { OVERLAY_OPEN } from '../ipcChannels';

function getDisplayMedia() {
  return new Promise(async (resolve, reject) => {
    ipcRenderer.once(SET_DESKTOP_CAPTURER_SOURCES_IPC_KEY, async (event, { sourceId }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
          },
        },
      });

      resolve(stream);
    });

    const overlayAction = await ipcRenderer.invoke(OVERLAY_OPEN, {
      route: '/screen-share/{webContentsId}',
      modal: false,
      width: 600,
    });

    if (overlayAction === 'closed') {
      reject(new Error('Source selection canceled'));
    }
  });
}

window.navigator.mediaDevices.getDisplayMedia = getDisplayMedia;
