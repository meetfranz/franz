import React, { Component } from 'react';
import { observer } from 'mobx-react';

import TodosWebview from '../components/TodosWebview';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { TODOS_MIN_WIDTH, todosStore } from '..';
import { todoActions } from '../actions';

@observer
class TodosScreen extends Component {
  render() {
    if (!todosStore || !todosStore.isFeatureActive) {
      return null;
    }

    return (
      <ErrorBoundary>
        <TodosWebview
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
