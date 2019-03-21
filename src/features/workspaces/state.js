import { observable } from 'mobx';

const defaultState = {
  activeWorkspace: null,
  nextWorkspace: null,
  isLoadingWorkspaces: false,
  isFeatureActive: false,
  isSwitchingWorkspace: false,
  isWorkspaceDrawerOpen: false,
  workspaces: [],
  workspaceBeingEdited: null,
};

export const workspacesState = observable(defaultState);

export function resetState() {
  Object.assign(workspacesState, defaultState);
}
