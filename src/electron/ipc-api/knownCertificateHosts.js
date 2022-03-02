import { ipcMain, session } from 'electron';

const debug = require('debug')('Franz:ipcApi:serviceCache');

export default () => {
  ipcMain.on('knownCertificateHosts', (_e, { knownHosts, serviceId }) => {
    debug(
      `Received knownCertificateHosts ${knownHosts} for serviceId ${serviceId}`,
    );
    session
      .fromPartition(`persist:service-${serviceId}`)
      .setCertificateVerifyProc((request, callback) => {
      // To know more about these callbacks: https://www.electronjs.org/docs/api/session#sessetcertificateverifyprocproc
        const { hostname } = request;
        if (
          knownHosts.find(item => item.includes(hostname))
            .length > 0
        ) {
          callback(0);
        } else {
          callback(-2);
        }
      });
  });
};
