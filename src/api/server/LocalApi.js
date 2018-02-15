import { remote } from 'electron';
import du from 'du';

import { getServicePartitionsDirectory } from '../../helpers/service-helpers.js';

const { session } = remote;

export default class LocalApi {
  // Services
  async getAppCacheSize() {
    const partitionsDir = getServicePartitionsDirectory();
    return new Promise((resolve, reject) => {
      du(partitionsDir, (err, size) => {
        if (err) reject(err);

        console.debug('LocalApi::getAppCacheSize resolves', size);
        resolve(size);
      });
    });
  }

  async clearCache(serviceId) {
    const s = session.fromPartition(`persist:service-${serviceId}`);

    console.debug('LocalApi::clearCache resolves', serviceId);
    return new Promise(resolve => s.clearCache(resolve));
  }

  async clearAppCache() {
    const s = session.defaultSession;

    console.debug('LocalApi::clearCache clearAppCache');
    return new Promise(resolve => s.clearCache(resolve));
  }
}
