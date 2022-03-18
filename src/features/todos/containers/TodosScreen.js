import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import FeaturesStore from '../../../stores/FeaturesStore';
import TodosWebview from '../components/TodosWebview';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { TODOS_MIN_WIDTH, todosStore } from '..';
import { todoActions } from '../actions';
import ServicesStore from '../../../stores/ServicesStore';
import UIStore from '../../../stores/UIStore';

@inject('stores', 'actions') @observer
class TodosScreen extends Component {
  render() {
    if (!todosStore || !todosStore.isFeatureActive || todosStore.isTodosPanelForceHidden) {
      return null;
    }

    return (
      <ErrorBoundary>
        <TodosWebview
          isTodosServiceActive={this.props.stores.services.isTodosServiceActive || false}
          activeTodosService={this.props.stores.services.allDisplayed.find(service => service.isTodos)}
          isVisible={todosStore.isTodosPanelVisible}
          togglePanel={todoActions.toggleTodosPanel}
          width={todosStore.width}
          minWidth={TODOS_MIN_WIDTH}
          resize={width => todoActions.resize({ width })}
          isTodosIncludedInCurrentPlan={this.props.stores.features.features.isTodosIncludedInCurrentPlan || false}
          isSettingsRouteActive={this.props.stores.ui.isSettingsRouteActive}
        />
      </ErrorBoundary>
    );
  }
}

export default TodosScreen;

TodosScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    services: PropTypes.instanceOf(ServicesStore).isRequired,
    ui: PropTypes.instanceOf(UIStore).isRequired,
  }).isRequired,
};
