import { reaction } from 'mobx';
import { ServiceLimitStore } from './store';

const debug = require('debug')('Franz:feature:serviceLimit');

export const DEFAULT_SERVICE_LIMIT = 3;

let store = null;

export const serviceLimitStore = new ServiceLimitStore();

export default function initServiceLimit(stores, actions) {
  const { features } = stores;

  // Toggle serviceLimit feature
  reaction(
    () => (
      features.features.isServiceLimitEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `serviceLimit` feature');
        store = serviceLimitStore.start(stores, actions);
      } else if (store) {
        debug('Disabling `serviceLimit` feature');
        serviceLimitStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}
