import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import uuid from 'uuid/v4';

import { Icon } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

// interface IStoreArgs {
//   value?: boolean;
//   checked?: boolean;
//   label?: string;
//   id?: string;
//   name?: string;
//   disabled?: boolean;
//   error?: string;
// }

// const createStore = (args?: IStoreArgs) => {
//   return observable(Object.assign({
//     id: `element-${uuid()}`,
//     name: 'toggle',
//     label: 'Label',
//     value: true,
//     checked: false,
//     disabled: false,
//     error: '',
//   },                              args));
// };

// const WithStoreToggle = observer(({ store }: { store: any }) => (
//   <>
//     <Toggle
//       value={store.value}
//       checked={store.checked}
//       label={store.label}
//       id={store.id}
//       name={store.name}
//       disabled={store.disabled}
//       error={store.error}
//       onChange={() => store.checked = !store.checked}
//     />
//   </>
// ));

storiesOf('Icon')
  .add('Basic', () => (
    <>
      <Icon icon="mdiAccountCircle" />
      <Icon icon="mdiAccountCircle" size={2} />
      <Icon icon="mdiAccountCircle" size={3} />
    </>
  ));
