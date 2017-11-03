import emailParser from 'address-rfc2822';

export default class Recipe {
  id = '';
  name = '';
  description = '';
  version = '1.0';
  path = '';

  serviceURL = '';

  hasDirectMessages = true;
  hasIndirectMessages = false;
  hasNotificationSound = false;
  hasTeamId = false;
  hasPredefinedUrl = false;
  hasCustomUrl = false;
  urlInputPrefix = '';
  urlInputSuffix = '';

  message = '';

  constructor(data) {
    if (!data) {
      throw Error('Recipe config not valid');
    }

    if (!data.id) {
      // Franz 4 recipes do not have an Id
      throw Error(`Recipe '${data.name}' requires Id`);
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.rawAuthor = data.author || this.author;
    this.description = data.description || this.description;
    this.version = data.version || this.version;
    this.path = data.path;

    this.serviceURL = data.config.serviceURL || this.serviceURL;

    this.hasDirectMessages = data.config.hasDirectMessages || this.hasDirectMessages;
    this.hasIndirectMessages = data.config.hasIndirectMessages || this.hasIndirectMessages;
    this.hasNotificationSound = data.config.hasNotificationSound || this.hasNotificationSound;
    this.hasTeamId = data.config.hasTeamId || this.hasTeamId;
    this.hasPredefinedUrl = data.config.hasPredefinedUrl || this.hasPredefinedUrl;
    this.hasCustomUrl = data.config.hasCustomUrl || this.hasCustomUrl;

    this.urlInputPrefix = data.config.urlInputPrefix || this.urlInputPrefix;
    this.urlInputSuffix = data.config.urlInputSuffix || this.urlInputSuffix;

    this.message = data.config.message || this.message;
  }

  get author() {
    try {
      const addresses = emailParser.parse(this.rawAuthor);
      return addresses.map(a => ({ email: a.address, name: a.phrase }));
    } catch (err) {
      console.warn(`Not a valid author for ${this.name}`);
    }

    return [];
  }
}
