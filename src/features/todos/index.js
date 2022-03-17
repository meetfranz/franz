import { reaction } from 'mobx';
import { TODOS_RECIPE_ID as TODOS_RECIPE } from '../../config';
import TodoStore from './store';

const debug = require('debug')('Franz:feature:todos');

export const GA_CATEGORY_TODOS = 'Todos';

export const DEFAULT_TODOS_WIDTH = 300;
export const TODOS_MIN_WIDTH = 200;
export const DEFAULT_TODOS_VISIBLE = true;
export const DEFAULT_IS_FEATURE_ENABLED_BY_USER = true;
export const TODOS_RECIPE_ID = TODOS_RECIPE;
export const TODOS_PARTITION_ID = 'persist:todos';

export const TODOS_ROUTES = {
  TARGET: '/todos',
};

export const todosStore = new TodoStore();

export default function initTodos(stores, actions) {
  stores.todos = todosStore;
  const { features } = stores;

  // Franz todos is now deeply baked into Franz, therefore the recipe is always needed
  if (!stores.recipes.isInstalled(TODOS_RECIPE_ID)) {
    console.log('Todos recipe is not installed, installing now...');
    actions.recipe.install({ recipeId: TODOS_RECIPE_ID });
  }

  // Toggle todos feature
  reaction(
    () => features.features.isTodosEnabled,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `todos` feature');
        todosStore.start(stores, actions);
      } else if (todosStore.isFeatureActive) {
        debug('Disabling `todos` feature');
        todosStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}
