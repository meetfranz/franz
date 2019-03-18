import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import uuid from 'uuid/v4';

import { Loader } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

storiesOf('Loader')
  .add('Basic', () => (
    <>
      <Loader />
    </>
  ));
