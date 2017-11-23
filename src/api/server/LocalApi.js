import SettingsModel from '../../models/Settings';

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
      const settings = new SettingsModel(JSON.parse(settingsString) || {});
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
}
