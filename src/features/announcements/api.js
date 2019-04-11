import { remote } from 'electron';
import Request from '../../stores/lib/Request';

const debug = require('debug')('Franz:feature:announcements:api');

export const announcementsApi = {
  async getCurrentVersion() {
    debug('getting current version of electron app');
    return Promise.resolve(remote.app.getVersion());
  },

  async getAnnouncementForVersion(version) {
    debug('fetching release announcement from Github');
    const url = `https://api.github.com/repos/meetfranz/franz/releases/tags/v${version}`;
    const request = await window.fetch(url, { method: 'GET' });
    if (!request.ok) throw request;
    const data = await request.json();
    return data.body;
  },
};

export const getCurrentVersionRequest = new Request(announcementsApi, 'getCurrentVersion');
export const getAnnouncementRequest = new Request(announcementsApi, 'getAnnouncementForVersion');
