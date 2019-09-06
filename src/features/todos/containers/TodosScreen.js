import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import FeaturesStore from '../../../stores/FeaturesStore';
import TodosWebview from '../components/TodosWebview';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { TODOS_MIN_WIDTH, todosStore } from '..';
import { todoActions } from '../actions';

@inject('stores', 'actions') @observer
class TodosScreen extends Component {
  render() {
    if (!todosStore || !todosStore.isFeatureActive || todosStore.isTodosPanelForceHidden) {
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
          isTodosIncludedInCurrentPlan={this.props.stores.features.features.isTodosIncludedInCurrentPlan || false}
        />
      </ErrorBoundary>
    );
  }
}

export default TodosScreen;

TodosScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
  }).isRequired,
};
