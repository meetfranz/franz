import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const todoActions = createActionsFromDefinitions({
  resize: {
    width: PropTypes.number.isRequired,
  },
  setTodosWebview: {
    webview: PropTypes.element.isRequired,
  },
  handleHostMessage: {
    action: PropTypes.string.isRequired,
    data: PropTypes.object,
  },
  handleClientMessage: {
    action: PropTypes.string.isRequired,
    data: PropTypes.object,
  },
}, PropTypes.checkPropTypes);

export default todoActions;
