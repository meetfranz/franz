import { observable } from 'mobx';

const defaultState = {
  name: null,
  isFeatureActive: false,
};

export const exampleFeatureState = observable(defaultState);

export function resetState() {
  Object.assign(exampleFeatureState, defaultState);
}

export default exampleFeatureState;
