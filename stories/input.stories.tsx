import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input } from '../packages/forms/src';

console.log('stories');

const defaultProps = {
  label: 'Label',
  id: 'test1',
  name: 'test1',
  onChange: action('changed'),
  focus: true,
};

const defaultPasswordProps = {
  label: 'Password',
  type: 'password',
  id: 'test1',
  name: 'test1',
  onChange: action('changed'),
  focus: true,
};

storiesOf('Input', module)
  .add('Basic', () => (
    <Input
      {...defaultProps}
      placeholder="Placeholder text"
    />
  ))
  .add('Without Label', () => (
    <Input
      {...defaultProps}
      showLabel={false}
    />
  ))
  .add('Disabled', () => (
    <Input {...defaultProps} disabled />
  ))
  .add('With prefix', () => (
    <Input
      {...defaultProps}
      prefix="https://"
    />
  ))
  .add('With suffix', () => (
    <Input
      {...defaultProps}
      suffix=".meetfranz.com"
    />
  ))
  .add('With pre-/suffix', () => (
    <Input
      {...defaultProps}
      prefix="https://"
      suffix=".meetfranz.com"
    />
  ))
  .add('With error', () => (
    <Input
      {...defaultProps}
      value="faulty input"
      error="This is a generic error message."
    />
  ));

storiesOf('Password', module)
  // .addDecorator(withThemesProvider(themes))
  .add('Basic', () => (
    <Input
      {...defaultPasswordProps}
    />
  ))
  .add('Show password toggle', () => (
    <Input
      {...defaultPasswordProps}
      showPasswordToggle
    />
  ))
  .add('Score password', () => (
    <Input
      {...defaultPasswordProps}
      showPasswordToggle
      scorePassword
    />
  ))
  .add('Score password with error', () => (
    <Input
      {...defaultPasswordProps}
      error="Password is too short"
      showPasswordToggle
      scorePassword
    />
  ));
