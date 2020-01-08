import PropTypes from 'prop-types';

export default {
  createHostedPage: {
    planId: PropTypes.string.isRequired,
  },
  upgradeAccount: {
    planId: PropTypes.string.isRequired,
    onCloseWindow: PropTypes.func,
  },
  createDashboardUrl: {},
};
