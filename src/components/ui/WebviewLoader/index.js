import React from 'react';
import PropTypes from 'prop-types';

import FullscreenLoader from '../FullscreenLoader';

const WebviewLoader = ({ name }) => (
  <FullscreenLoader
    title={`Loading ${name}`}
  />
);

WebviewLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

export default WebviewLoader;
