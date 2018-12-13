import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';

import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import RecipeItem from './RecipeItem';
import Loader from '../../ui/Loader';
import Appear from '../../ui/effects/Appear';
import { FRANZ_SERVICE_REQUEST } from '../../../config';

const messages = defineMessages({
  headline: {
    id: 'settings.recipes.headline',
    defaultMessage: '!!!Available Services',
  },
  searchService: {
    id: 'settings.searchService',
    defaultMessage: '!!!Search service',
  },
  mostPopularRecipes: {
    id: 'settings.recipes.mostPopular',
    defaultMessage: '!!!Most popular',
  },
  allRecipes: {
    id: 'settings.recipes.all',
    defaultMessage: '!!!All services',
  },
  devRecipes: {
    id: 'settings.recipes.dev',
    defaultMessage: '!!!Development',
  },
  nothingFound: {
    id: 'settings.recipes.nothingFound',
    defaultMessage: '!!!Sorry, but no service matched your search term.',
  },
  servicesSuccessfulAddedInfo: {
    id: 'settings.recipes.servicesSuccessfulAddedInfo',
    defaultMessage: '!!!Service successfully added',
  },
  missingService: {
    id: 'settings.recipes.missingService',
    defaultMessage: '!!!Missing a service?',
  },
});

export default @observer class RecipesDashboard extends Component {
  static propTypes = {
    recipes: MobxPropTypes.arrayOrObservableArray.isRequired,
    isLoading: PropTypes.bool.isRequired,
    hasLoadedRecipes: PropTypes.bool.isRequired,
    showAddServiceInterface: PropTypes.func.isRequired,
    searchRecipes: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    serviceStatus: MobxPropTypes.arrayOrObservableArray.isRequired,
    devRecipesCount: PropTypes.number.isRequired,
    searchNeedle: PropTypes.string,
  };

  static defaultProps = {
    searchNeedle: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      recipes,
      isLoading,
      hasLoadedRecipes,
      showAddServiceInterface,
      searchRecipes,
      resetSearch,
      serviceStatus,
      devRecipesCount,
      searchNeedle,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body recipes">
          {serviceStatus.length > 0 && serviceStatus.includes('created') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.servicesSuccessfulAddedInfo)}
              </Infobox>
            </Appear>
          )}
          <SearchInput
            placeholder={intl.formatMessage(messages.searchService)}
            onChange={e => searchRecipes(e)}
            onReset={() => resetSearch()}
            autoFocus
            throttle
          />
          <div className="recipes__navigation">
            <Link
              to="/settings/recipes"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.mostPopularRecipes)}
            </Link>
            <Link
              to="/settings/recipes/all"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.allRecipes)}
            </Link>
            {devRecipesCount > 0 && (
              <Link
                to="/settings/recipes/dev"
                className="badge"
                activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
                onClick={() => resetSearch()}
              >
                {intl.formatMessage(messages.devRecipes)}
                {' '}
(
                {devRecipesCount}
)
              </Link>
            )}
            <a href={FRANZ_SERVICE_REQUEST} target="_blank" className="link recipes__service-request">
              {intl.formatMessage(messages.missingService)}
              {' '}
              <i className="mdi mdi-open-in-new" />
            </a>
          </div>
          {/* )} */}
          {isLoading ? (
            <Loader />
          ) : (
            <div className="recipes__list">
              {hasLoadedRecipes && recipes.length === 0 && (
                <p className="align-middle settings__empty-state">
                  <span className="emoji">
                    <img src="./assets/images/emoji/dontknow.png" alt="" />
                  </span>
                  {intl.formatMessage(messages.nothingFound)}
                </p>
              )}
              {recipes.map(recipe => (
                <RecipeItem
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => showAddServiceInterface({ recipeId: recipe.id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
