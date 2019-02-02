// @flow

export default class RecipePreview {
  id = '';

  name = '';

  icon = '';

  // TODO: check if this isn't replaced by `icons`
  featured = false;

  constructor(data) {
    if (!data.id) {
      throw Error('RecipePreview requires Id');
    }

    Object.assign(this, data);
  }
}
