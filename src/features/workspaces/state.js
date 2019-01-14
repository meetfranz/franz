import { observable } from 'mobx';

const defaultState = {
  isLoading: false,
  workspaces: [],
};

export const state = observable(defaultState);

export function resetState() {
  Object.assign(state, defaultState);
}
