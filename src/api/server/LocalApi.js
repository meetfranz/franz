import { remote } from 'electron';

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
  async clearCache(serviceId) {
    console.debug(`Clearing cache for persist:service-${serviceId}`);
    const s = session.fromPartition(`persist:service-${serviceId}`);
    await new Promise(resolve => s.clearCache(resolve));
  }
}
