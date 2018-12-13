export default class Order {
  id = '';

  subscriptionId = '';

  name = '';

  invoiceUrl = '';

  price = '';

  date = '';

  constructor(data) {
    this.id = data.id;
    this.subscriptionId = data.subscriptionId;
    this.name = data.name || this.name;
    this.invoiceUrl = data.invoiceUrl || this.invoiceUrl;
    this.price = data.price || this.price;
    this.date = data.date || this.date;
  }
}
