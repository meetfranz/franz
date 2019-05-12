import React from 'react';

import { Badge, ProBadge } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

storiesOf('Badge')
  .add('Basic', () => (
    <>
      <Badge>New</Badge>
    </>
  ))
  .add('Styles', () => (
    <>
      <Badge type="primary">Primary</Badge>
      <Badge type="secondary">secondary</Badge>
      <Badge type="success">success</Badge>
      <Badge type="warning">warning</Badge>
      <Badge type="danger">danger</Badge>
      <Badge type="inverted">inverted</Badge>
    </>
  ))
  .add('Pro Badge', () => (
    <>
      <ProBadge />
    </>
  ))
  .add('Pro Badge inverted', () => (
    <>
      <ProBadge inverted />
    </>
  ));
