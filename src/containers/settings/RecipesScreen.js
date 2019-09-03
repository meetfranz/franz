import { remote, shell } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import path from 'path';

import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import RecipeStore from '../../stores/RecipesStore';
import ServiceStore from '../../stores/ServicesStore';
import UserStore from '../../stores/UserStore';

import RecipesDashboard from '../../components/settings/recipes/RecipesDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { FRANZ_DEV_DOCS } from '../../config';
import { gaEvent } from '../../lib/analytics';
import { communityRecipesStore } from '../../features/communityRecipes';

const { app } = remote;

export default @inject('stores', 'actions') @observer class RecipesScreen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      filter: PropTypes.string,
    }),
  };

  static defaultProps = {
    params: {
      filter: null,
    },
  };

  state = {
    needle: null,
    currentFilter: 'featured',
  };

  autorunDisposer = null;

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      const { filter } = this.props.params;
      const { currentFilter } = this.state;

      if (filter === 'all' && currentFilter !== 'all') {
        this.setState({ currentFilter: 'all' });
      } else if (filter === 'featured' && currentFilter !== 'featured') {
        this.setState({ currentFilter: 'featured' });
      } else if (filter === 'dev' && currentFilter !== 'dev') {
        this.setState({ currentFilter: 'dev' });
      }
    });
  }

  componentWillUnmount() {
    this.props.stores.services.resetStatus();
    this.autorunDisposer();
  }

  searchRecipes(needle) {
    if (needle === '') {
      this.resetSearch();
    } else {
      const { search } = this.props.actions.recipePreview;
      this.setState({ needle });
      search({ needle });
    }
  }

  resetSearch() {
    this.setState({ needle: null });
  }

  render() {
    const {
      recipePreviews,
      recipes,
      services,
      user,
    } = this.props.stores;

    const {
      app: appActions,
      service: serviceActions,
    } = this.props.actions;

    const { filter } = this.props.params;
    let recipeFilter;

    if (filter === 'all') {
      recipeFilter = recipePreviews.all;
    } else if (filter === 'dev') {
      recipeFilter = communityRecipesStore.communityRecipes;
    } else {
      recipeFilter = recipePreviews.featured;
    }

    const allRecipes = this.state.needle ? recipePreviews.searchResults : recipeFilter;

    const isLoading = recipePreviews.featuredRecipePreviewsRequest.isExecuting
      || recipePreviews.allRecipePreviewsRequest.isExecuting
      || recipes.installRecipeRequest.isExecuting
      || recipePreviews.searchRecipePreviewsRequest.isExecuting;

    const recipeDirectory = path.join(app.getPath('userData'), 'recipes', 'dev');

    return (
      <ErrorBoundary>
        <RecipesDashboard
          recipes={allRecipes}
          isLoading={isLoading}
          addedServiceCount={services.all.length}
          isPremium={user.data.isPremium}
          hasLoadedRecipes={recipePreviews.featuredRecipePreviewsRequest.wasExecuted}
          showAddServiceInterface={serviceActions.showAddServiceInterface}
          searchRecipes={e => this.searchRecipes(e)}
          resetSearch={() => this.resetSearch()}
          searchNeedle={this.state.needle}
          serviceStatus={services.actionStatus}
          recipeFilter={filter}
          recipeDirectory={recipeDirectory}
          openRecipeDirectory={() => {
            shell.openItem(recipeDirectory);
            gaEvent('Recipe', 'open-recipe-folder', 'Open Folder');
          }}
          openDevDocs={() => {
            appActions.openExternalUrl({ url: FRANZ_DEV_DOCS });
            gaEvent('Recipe', 'open-dev-docs', 'Developer Documentation');
          }}
          isCommunityRecipesIncludedInCurrentPlan={communityRecipesStore.isCommunityRecipesIncludedInCurrentPlan}
          isUserPremiumUser={user.isPremium}
        />
      </ErrorBoundary>
    );
  }
}

RecipesScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    recipePreviews: PropTypes.instanceOf(RecipePreviewsStore).isRequired,
    recipes: PropTypes.instanceOf(RecipeStore).isRequired,
    services: PropTypes.instanceOf(ServiceStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    service: PropTypes.shape({
      showAddServiceInterface: PropTypes.func.isRequired,
    }).isRequired,
    recipePreview: PropTypes.shape({
      search: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
