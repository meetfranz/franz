import {
  computed,
  action,
  observable,
} from 'mobx';
import localStorage from 'mobx-localstorage';

import { todoActions } from './actions';
import { FeatureStore } from '../utils/FeatureStore';
import { createReactions } from '../../stores/lib/Reaction';
import { createActionBindings } from '../utils/ActionBinding';
import { DEFAULT_TODOS_WIDTH, TODOS_MIN_WIDTH } from '.';

const debug = require('debug')('Franz:feature:todos:store');

export default class TodoStore extends FeatureStore {
  @observable isFeatureEnabled = false;

  @observable isFeatureActive = false;

  @computed get width() {
    const width = this.settings.width || DEFAULT_TODOS_WIDTH;

    return width < TODOS_MIN_WIDTH ? TODOS_MIN_WIDTH : width;
  }

  @computed get settings() {
    return localStorage.getItem('todos') || {};
  }

  // ========== PUBLIC API ========= //

  @action start(stores, actions) {
    debug('TodoStore::start');
    this.stores = stores;
    this.actions = actions;

    // ACTIONS

    this._registerActions(createActionBindings([
      [todoActions.resize, this._resize],
    ]));

    // REACTIONS

    this._allReactions = createReactions([
      this._setFeatureEnabledReaction,
    ]);

    this._registerReactions(this._allReactions);

    this.isFeatureActive = true;
  }

  @action stop() {
    super.stop();
    debug('TodoStore::stop');
    this.reset();
    this.isFeatureActive = false;
  }

  // ========== PRIVATE METHODS ========= //

  _updateSettings = (changes) => {
    localStorage.setItem('todos', {
      ...this.settings,
      ...changes,
    });
  };

  // Actions

  @action _resize = ({ width }) => {
    this._updateSettings({
      width,
    });
  };

  // Reactions

  _setFeatureEnabledReaction = () => {
    const { isTodosEnabled } = this.stores.features.features;

    this.isFeatureEnabled = isTodosEnabled;
  };
}
