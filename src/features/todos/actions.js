import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const todoActions = createActionsFromDefinitions({
  resize: {
    width: PropTypes.number.isRequired,
  },
  toggleTodosPanel: {},
  toggleTodosFeatureVisibility: {},
  setTodosWebview: {
    webview: PropTypes.instanceOf(Element).isRequired,
  },
  handleHostMessage: {
    action: PropTypes.string.isRequired,
    data: PropTypes.object,
  },
  handleClientMessage: {
    channel: PropTypes.string.isRequired,
    message: PropTypes.shape({
      action: PropTypes.string.isRequired,
      data: PropTypes.object,
    }),
  },
  openDevTools: {},
  reload: {},
}, PropTypes.checkPropTypes);

export default todoActions;
