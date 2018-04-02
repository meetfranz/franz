import { ipcRenderer, remote } from 'electron';
import du from 'du';

import { getServicePartitionsDirectory } from '../../helpers/service-helpers.js';

const debug = require('debug')('LocalApi');

const { session } = remote;

export default class LocalApi {
  // Settings
  getAppSettings() {
    return new Promise((resolve) => {
      ipcRenderer.once('appSettings', (event, data) => {
        debug('LocalApi::getAppSettings resolves', data);
        resolve(data);
      });

      ipcRenderer.send('getAppSettings');
    });
  }

  async updateAppSettings(data) {
    debug('LocalApi::updateAppSettings resolves', data);
    ipcRenderer.send('updateAppSettings', data);
  }

  // Services
  async getAppCacheSize() {
    const partitionsDir = getServicePartitionsDirectory();
    return new Promise((resolve, reject) => {
      du(partitionsDir, (err, size) => {
        if (err) reject(err);

        debug('LocalApi::getAppCacheSize resolves', size);
        resolve(size);
      });
    });
  }

  async clearCache(serviceId) {
    const s = session.fromPartition(`persist:service-${serviceId}`);

    debug('LocalApi::clearCache resolves', serviceId);
    return new Promise(resolve => s.clearCache(resolve));
  }

  async clearAppCache() {
    const s = session.defaultSession;

    debug('LocalApi::clearCache clearAppCache');
    return new Promise(resolve => s.clearCache(resolve));
  }
}
