import PropTypes from 'prop-types';

export default {
  openSettings: {
    path: PropTypes.string,
  },
  closeSettings: {},
  toggleServiceUpdatedInfoBar: {
    visible: PropTypes.bool,
  },
  reorderServiceStructure: {
    structure: PropTypes.array.isRequired,
  },
};
