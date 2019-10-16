import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const trialStatusBarActions = createActionsFromDefinitions({
  upgradeAccount: {
    planId: PropTypes.string.isRequired,
    onCloseWindow: PropTypes.func.isRequired,
  },
  downgradeAccount: {},
  hideOverlay: {},
}, PropTypes.checkPropTypes);

export default trialStatusBarActions;
