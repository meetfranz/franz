// @flow

export default class RecipePreview {
  id: string = '';
  name: string = '';
  icon: string = ''; // TODO: check if this isn't replaced by `icons`
  featured: bool = false;

  constructor(data) {
    if (!data.id) {
      throw Error('RecipePreview requires Id');
    }

    Object.assign(this, data);
  }
}
