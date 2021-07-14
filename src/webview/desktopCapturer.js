import { ipcRenderer } from 'electron';

function getDisplayMedia(constraints = {}) {
  console.log('constraints', constraints);
  return new Promise(async (resolve, reject) => {
    let selectedSourceId = null;

    console.log('sending feature:desktopCapturer:getSelectSource');
    ipcRenderer.sendToHost('feature:desktopCapturer:getSelectSource');

    ipcRenderer.once('feature:desktopCapturer:setSelectSource', async (event, { sourceId }) => {
      console.log('set selected source', sourceId);
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
      console.log('cancel selection');
      if (!selectedSourceId) {
        reject(new Error('Source selection canceled'));
      }

      selectedSourceId = null;
    });
  });
}

window.navigator.mediaDevices.getDisplayMedia = getDisplayMedia;
