import PropTypes from 'prop-types';

export default {
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
};
