import { ipcRenderer } from 'electron';

function getDisplayMedia() {
  return new Promise(async (resolve, reject) => {
    let selectedSourceId = null;

    ipcRenderer.sendToHost('feature:desktopCapturer:getSelectSource');

    ipcRenderer.once('feature:desktopCapturer:setSelectSource', async (event, { sourceId }) => {
      selectedSourceId = sourceId;

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

    ipcRenderer.once('feature:desktopCapturer:cancelSelectSource', () => {
      if (!selectedSourceId) {
        reject(new Error('Source selection canceled'));
      }

      selectedSourceId = null;
    });
  });
}

window.navigator.mediaDevices.getDisplayMedia = getDisplayMedia;
