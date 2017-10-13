import PropTypes from 'prop-types';

export default {
  update: {
    settings: PropTypes.object.isRequired,
  },
  remove: {
    key: PropTypes.string.isRequired,
  },
};
