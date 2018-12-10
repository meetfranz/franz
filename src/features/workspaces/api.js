// TODO: use real server instead
const workspaces = [
  { id: 'workspace-1', name: 'Private' },
  { id: 'workspace-2', name: 'Office' },
];

export default {
  getUserWorkspaces: () => Promise.resolve(workspaces),
};
