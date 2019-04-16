export const createActionsFromDefinitions = (actionDefinitions, validate) => {
  const actions = {};
  Object.keys(actionDefinitions).forEach((actionName) => {
    const action = (params = {}) => {
      const schema = actionDefinitions[actionName];
      validate(schema, params, actionName);
      action.notify(params);
    };
    actions[actionName] = action;
    action.listeners = [];
    action.listen = listener => action.listeners.push(listener);
    action.off = (listener) => {
      const { listeners } = action;
      listeners.splice(listeners.indexOf(listener), 1);
    };
    action.notify = params => action.listeners.forEach(listener => listener(params));
  });
  return actions;
};

export default (definitions, validate) => {
  const newActions = {};
  Object.keys(definitions).forEach((scopeName) => {
    newActions[scopeName] = createActionsFromDefinitions(definitions[scopeName], validate);
  });
  return newActions;
};
