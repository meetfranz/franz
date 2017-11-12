import React from 'react';

import Appear from '../../components/ui/effects/Appear';
import Loader from '../../components/ui/Loader';

export default function () {
  return (
    <div className="app-loader">
      <Appear>
        <h1 className="app-loader__title">Franz</h1>
        <Loader color="#FFF" />
      </Appear>
    </div>
  );
}
