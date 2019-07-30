import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const todoActions = createActionsFromDefinitions({
  resize: {
    width: PropTypes.number.isRequired,
  },
}, PropTypes.checkPropTypes);

export default todoActions;
