export default (definitions, validate) => {
  const newActions = {};
  Object.keys(definitions).forEach((scopeName) => {
    newActions[scopeName] = {};
    Object.keys(definitions[scopeName]).forEach((actionName) => {
      const action = (params) => {
        const schema = definitions[scopeName][actionName];
        validate(schema, params, actionName);
        action.notify(params);
      };
      newActions[scopeName][actionName] = action;
      action.listeners = [];
      action.listen = listener => action.listeners.push(listener);
      action.notify = params => action.listeners.forEach(listener => listener(params));
    });
  });
  return newActions;
};
