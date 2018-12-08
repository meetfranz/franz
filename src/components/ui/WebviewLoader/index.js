import React from 'react';

import FullscreenLoader from '../FullscreenLoader';

export default ({ name }) => (
  <FullscreenLoader
    title={`Loading ${name}`}
  />
);
