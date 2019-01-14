import { observable } from 'mobx';

const defaultState = {
  isLoading: false,
  workspaces: [],
  workspaceBeingEdited: null,
};

export const state = observable(defaultState);

export function resetState() {
  Object.assign(state, defaultState);
}
