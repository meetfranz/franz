export default class Recipe {
  id = '';
  name = '';
  author = '';
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
      throw Error('Recipe requires Id');
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.author = data.author || this.author;
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
}
