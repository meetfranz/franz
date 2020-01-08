import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const planSelectionActions = createActionsFromDefinitions({
  downgradeAccount: {},
  hideOverlay: {},
}, PropTypes.checkPropTypes);

export default planSelectionActions;
