import { observable } from 'mobx';

const defaultState = {
  activeWorkspace: null,
  isLoading: false,
  isFeatureActive: false,
  workspaces: [],
  workspaceBeingEdited: null,
};

export const workspacesState = observable(defaultState);

export function resetState() {
  Object.assign(workspacesState, defaultState);
}
