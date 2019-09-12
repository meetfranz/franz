const debug = require('debug')('Ferdi:feature:basicAuth:main');

export default function mainIpcHandler(mainWindow, authInfo) {
  debug('Sending basic auth call', authInfo);

  mainWindow.webContents.send('feature:basic-auth', {
    authInfo,
  });
}
