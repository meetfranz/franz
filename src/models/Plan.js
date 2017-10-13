// @flow

export default class Plan {
  month: {
    id: '',
    price: 0,
  }
  year: {
    id: '',
    price: 0,
  }

  constructor(data: Object) {
    Object.assign(this, data);
  }
}
