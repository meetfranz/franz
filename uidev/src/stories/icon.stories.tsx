import { mdiAccountCircle } from '@mdi/js';
import React from 'react';

import { Icon } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

storiesOf('Icon')
  .add('Basic', () => (
    <>
      <Icon icon={mdiAccountCircle} />
      <Icon icon={mdiAccountCircle} size={2} />
      <Icon icon={mdiAccountCircle} size={3} />
    </>
  ));
