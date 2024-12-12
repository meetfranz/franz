// @flow

export default class News {
  id = '';

  message = '';

  meta = {};

  type = 'primary';

  sticky = false;

  constructor(data) {
    if (!data.id) {
      throw Error('News requires Id');
    }

    this.id = data.id;
    this.message = data.message || this.message;
    this.meta = data.meta || this.meta;
    this.type = data.type || this.type;
    this.sticky = data.sticky !== undefined ? data.sticky : this.sticky;
  }
}
