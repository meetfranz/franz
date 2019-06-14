import { reaction } from 'mobx';
import { CommunityRecipesStore } from './store';

const debug = require('debug')('Franz:feature:communityRecipes');

export const DEFAULT_SERVICE_LIMIT = 3;

export const communityRecipesStore = new CommunityRecipesStore();

export default function initCommunityRecipes(stores, actions) {
  const { features } = stores;

  communityRecipesStore.start(stores, actions);

  // Toggle communityRecipe premium status
  reaction(
    () => (
      features.features.isCommunityRecipesPremiumFeature
    ),
    (isPremiumFeature) => {
      debug('Community recipes is premium feature: ', isPremiumFeature);
      communityRecipesStore.isCommunityRecipesPremiumFeature = isPremiumFeature;
    },
    {
      fireImmediately: true,
    },
  );
}
