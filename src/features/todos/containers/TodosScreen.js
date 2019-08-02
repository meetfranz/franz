import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import TodosWebview from '../components/TodosWebview';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import UserStore from '../../../stores/UserStore';
import { TODOS_MIN_WIDTH, todosStore } from '..';
import { todoActions } from '../actions';

@inject('stores') @observer
class TodosScreen extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      user: PropTypes.instanceOf(UserStore).isRequired,
    }).isRequired,
  };

  render() {
    const { stores } = this.props;

    if (!stores.todos || !stores.todos.isFeatureActive) {
      return null;
    }

    return (
      <ErrorBoundary>
        <TodosWebview
          authToken={stores.user.authToken}
          isVisible={todosStore.isTodosPanelVisible}
          togglePanel={todoActions.toggleTodosPanel}
          handleClientMessage={todoActions.handleClientMessage}
          setTodosWebview={webview => todoActions.setTodosWebview({ webview })}
          width={todosStore.width}
          minWidth={TODOS_MIN_WIDTH}
          resize={width => todoActions.resize({ width })}
        />
      </ErrorBoundary>
    );
  }
}

export default TodosScreen;
