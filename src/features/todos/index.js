import { reaction } from 'mobx';
import TodoStore from './store';

const debug = require('debug')('Franz:feature:todos');

export const GA_CATEGORY_TODOS = 'Todos';

export const DEFAULT_TODOS_WIDTH = 300;
export const TODOS_MIN_WIDTH = 200;

export const todoStore = new TodoStore();

export default function initTodos(stores, actions) {
  stores.todos = todoStore;
  const { features } = stores;

  // Toggle todos feature
  reaction(
    () => features.features.isTodosEnabled,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `todos` feature');
        todoStore.start(stores, actions);
      } else if (todoStore.isFeatureActive) {
        debug('Disabling `todos` feature');
        todoStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}
