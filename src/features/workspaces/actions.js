import PropTypes from 'prop-types';
import Workspace from './models/Workspace';

export default {
  edit: {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
  },
  create: {
    name: PropTypes.string.isRequired,
  },
  delete: {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
  },
  update: {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
  },
};
