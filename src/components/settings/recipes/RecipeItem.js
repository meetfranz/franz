import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import RecipePreviewModel from '../../../models/RecipePreview';

export default @observer class RecipeItem extends Component {
  static propTypes = {
    recipe: PropTypes.instanceOf(RecipePreviewModel).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { recipe, onClick } = this.props;

    return (
      <button
        type="button"
        className="recipe-teaser"
        onClick={onClick}
      >
        {recipe.local && (
          <span className="recipe-teaser__dev-badge">dev</span>
        )}
        <img
          src={recipe.icons.svg}
          className="recipe-teaser__icon"
          alt=""
        />
        <span className="recipe-teaser__label">{recipe.name}</span>
      </button>
    );
  }
}
