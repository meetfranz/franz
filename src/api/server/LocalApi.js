import { remote } from 'electron';
import du from 'du';

import { getServicePartitionsDirectory } from '../../helpers/service-helpers.js';

const { session } = remote;

export default class LocalApi {
  // App
  async updateAppSettings(data) {
    const currentSettings = await this.getAppSettings();
    const settings = Object.assign(currentSettings, data);

    localStorage.setItem('app', JSON.stringify(settings));
    console.debug('LocalApi::updateAppSettings resolves', settings);

    return settings;
  }

  async getAppSettings() {
    const settingsString = localStorage.getItem('app');
    try {
      const settings = JSON.parse(settingsString) || {};
      console.debug('LocalApi::getAppSettings resolves', settings);

      return settings;
    } catch (err) {
      return {};
    }
  }

  async removeKey(key) {
    const settings = await this.getAppSettings();

    if (Object.hasOwnProperty.call(settings, key)) {
      delete settings[key];
      localStorage.setItem('app', JSON.stringify(settings));
    }
  }

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
