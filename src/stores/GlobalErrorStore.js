import { observable, action } from 'mobx';
import Store from './lib/Store';
import Request from './lib/Request';

export default class GlobalErrorStore extends Store {
  @observable error = null;

  @observable response = {};

  constructor(...args) {
    super(...args);

    Request.registerHook(this._handleRequests);
  }

  _handleRequests = action(async (request) => {
    if (request.isError) {
      this.error = request.error;

      if (request.error.json) {
        try {
          this.response = await request.error.json();
        } catch (error) {
          this.response = {};
        }
        if (this.error.status === 401) {
          this.actions.user.logout({ serverLogout: true });
        }
      }
    }
  });
}
