import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../src/actions/lib/actions';

export const exampleFeatureActions = createActionsFromDefinitions({
  greet: {
    name: PropTypes.string.isRequired,
  },
}, PropTypes.checkPropTypes);

export default exampleFeatureActions;
