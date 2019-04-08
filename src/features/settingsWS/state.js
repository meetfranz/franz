import { observable } from 'mobx';

const defaultState = {
  isFeatureActive: false,
};

export const settingsWSState = observable(defaultState);

export function resetState() {
  Object.assign(settingsWSState, defaultState);
}

export default settingsWSState;
