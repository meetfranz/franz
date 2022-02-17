export const UPDATE_FULL_SCREEN_STATUS = 'set-full-screen-status';

export default ({ mainWindow }) => {
  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send(UPDATE_FULL_SCREEN_STATUS, true);
  });
  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send(UPDATE_FULL_SCREEN_STATUS, false);
  });
};
