import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const settingsWSActions = createActionsFromDefinitions({
  greet: {
    name: PropTypes.string.isRequired,
  },
}, PropTypes.checkPropTypes);

export default settingsWSActions;
