import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const announcementActions = createActionsFromDefinitions({
  show: {
    targetVersion: PropTypes.string,
  },
}, PropTypes.checkPropTypes);

export default announcementActions;
