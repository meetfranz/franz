import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { Button } from '@meetfranz/forms';
import { storiesOf } from '../stores/stories';

const defaultProps = {
  label: 'Button',
  id: 'test1',
  name: 'test1',
  type: 'button',
  disabled: false,
};

const createStore = (args?: any) => {
  return observable(Object.assign({}, defaultProps, args));
};

const WithStoreButton = observer(({ store }: { store: any }) => (
  <>
    <Button
      {...Object.assign({}, defaultProps, store)}
      onClick={!store.onClick ? () => {
        store.busy = !store.busy;

        window.setTimeout(() => {
          store.busy = !store.busy;
        },                1000);
      } : store.onClick}
    />
  </>
));

storiesOf('Button')
  .add('Basic', () => (
    <WithStoreButton store={createStore()} />
  ))
  .add('Secondary', () => (
    <WithStoreButton store={createStore({
      buttonType: 'secondary',
    })} />
  ))
  .add('Success', () => (
    <WithStoreButton store={createStore({
      buttonType: 'success',
    })} />
  ))
  .add('Warning', () => (
    <WithStoreButton store={createStore({
      buttonType: 'warning',
    })} />
  ))
  .add('Danger', () => (
    <WithStoreButton store={createStore({
      buttonType: 'danger',
    })} />
  ))
  .add('Inverted', () => (
    <WithStoreButton store={createStore({
      buttonType: 'inverted',
    })} />
  ))
  .add('Full width', () => (
    <WithStoreButton store={createStore({
      stretch: true,
    })} />
  ))
  .add('Disabled', () => (
    <WithStoreButton store={createStore({
      disabled: true,
    })} />
  ))
  .add('With loader', () => (
    <WithStoreButton store={createStore({
      busy: true,
    })} />
  ))
  .add('As link', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
    })} />
  ))
  .add('As link (target=_blank)', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
      target: '_blank',
    })} />
  ))
  .add('As link (with onClick)', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('Click event');
      },
    })} />));
