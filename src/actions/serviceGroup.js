import PropTypes from 'prop-types';

export default {
  setActive: {
    serviceId: PropTypes.string.isRequired,
  },
  setActiveNext: {},
  setActivePrev: {},
  showAddServiceInterface: {
    recipeId: PropTypes.string.isRequired,
  },
  createServiceGroup: {
    serviceGroupData: PropTypes.object.isRequired,
    redirect: PropTypes.string,
  },
  updateServiceGroup: {
    serviceGroupId: PropTypes.string.isRequired,
    serviceGroupData: PropTypes.object.isRequired,
    redirect: PropTypes.bool,
  },
  deleteServiceGroup: {
    serviceGroupId: PropTypes.string.isRequired,
    redirect: PropTypes.string,
  },
  setUnreadMessageCount: {
    serviceId: PropTypes.string.isRequired,
    count: PropTypes.object.isRequired,
  },
  toggleService: {
    serviceId: PropTypes.string.isRequired,
  },
  handleIPCMessage: {
    serviceId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    args: PropTypes.array.isRequired,
  },
  sendIPCMessage: {
    serviceId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    args: PropTypes.object.isRequired,
  },
  sendIPCMessageToAllServices: {
    channel: PropTypes.string.isRequired,
    args: PropTypes.object.isRequired,
  },
  openWindow: {
    event: PropTypes.object.isRequired,
  },
  reload: {
    serviceId: PropTypes.string.isRequired,
  },
  reloadActive: {},
  reloadAll: {},
  reloadUpdatedServices: {},
  filter: {
    needle: PropTypes.string.isRequired,
  },
  resetFilter: {},
  resetStatus: {},
  reorder: {
    oldIndex: PropTypes.number.isRequired,
    newIndex: PropTypes.number.isRequired,
  },
  toggleNotifications: {
    serviceId: PropTypes.string.isRequired,
  },
  toggleAudio: {
    serviceId: PropTypes.string.isRequired,
  },
  openDevTools: {
    serviceId: PropTypes.string.isRequired,
  },
  openDevToolsForActiveService: {},
};
