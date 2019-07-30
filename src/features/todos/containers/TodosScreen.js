import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import TodosWebview from '../components/TodosWebview';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import UserStore from '../../../stores/UserStore';
import TodoStore from '../store';
import { TODOS_MIN_WIDTH } from '..';

@inject('stores', 'actions') @observer
class TodosScreen extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      user: PropTypes.instanceOf(UserStore).isRequired,
      todos: PropTypes.instanceOf(TodoStore).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      todos: PropTypes.shape({
        resize: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { stores, actions } = this.props;

    if (!stores.todos || !stores.todos.isFeatureActive) {
      return null;
    }

    return (
      <ErrorBoundary>
        <TodosWebview
          authToken={stores.user.authToken}
          width={stores.todos.width}
          minWidth={TODOS_MIN_WIDTH}
          resize={width => actions.todos.resize({ width })}
        />
      </ErrorBoundary>
    );
  }
}

export default TodosScreen;
