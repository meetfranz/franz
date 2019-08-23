import { remote } from 'electron';
import Request from '../../stores/lib/Request';
import apiBase from '../apiBase';

const debug = require('debug')('Franz:feature:announcements:api');

export const announcementsApi = {
  async getCurrentVersion() {
    debug('getting current version of electron app');
    return Promise.resolve(remote.app.getVersion());
  },

  async getChangelog(version) {
    debug('fetching release changelog from Github');
    const url = `https://api.github.com/repos/meetfranz/franz/releases/tags/v${version}`;
    const request = await window.fetch(url, { method: 'GET' });
    if (!request.ok) return null;
    const data = await request.json();
    return data.body;
  },

  async getAnnouncement(version) {
    debug('fetching release announcement from api');
    const url = `${apiBase()}/announcements/${version}`;
    const response = await window.fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    return response.json();
  },
};

export const getCurrentVersionRequest = new Request(announcementsApi, 'getCurrentVersion');
export const getChangelogRequest = new Request(announcementsApi, 'getChangelog');
export const getAnnouncementRequest = new Request(announcementsApi, 'getAnnouncement');
