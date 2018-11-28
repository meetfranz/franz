import { autorun, reaction, observable } from 'mobx';
import { remote } from 'electron';

const { session } = remote;

const debug = require('debug')('Franz:feature:serviceProxy');

const DEFAULT_ENABLED = false;
const DEFAULT_IS_PREMIUM = true;

export const config = observable({
  isEnabled: DEFAULT_ENABLED,
  isPremium: DEFAULT_IS_PREMIUM,
});

export default function init(stores) {
  reaction(
    () => stores.features.features.isServiceProxyEnabled,
    (enabled, r) => {
      if (enabled) {
        debug('Initializing `serviceProxy` feature');

        // Dispose the reaction to run this only once
        r.dispose();

        const { isServiceProxyEnabled, isServiceProxyPremiumFeature } = stores.features.features;

        config.isEnabled = isServiceProxyEnabled !== undefined ? isServiceProxyEnabled : DEFAULT_ENABLED;
        config.isPremium = isServiceProxyPremiumFeature !== undefined ? isServiceProxyPremiumFeature : DEFAULT_IS_PREMIUM;

        autorun(() => {
          const services = stores.services.all;
          const isPremiumUser = stores.user.isPremium;

          if (config.isPremium && !isPremiumUser) return;

          services.forEach((service) => {
            const s = session.fromPartition(`persist:service-${service.id}`);
            let proxyHost = 'direct://';

            const serviceProxyConfig = stores.settings.proxy[service.id];

            if (serviceProxyConfig && serviceProxyConfig.isEnabled && serviceProxyConfig.host) {
              proxyHost = serviceProxyConfig.host;
            }

            s.setProxy({ proxyRules: proxyHost }, (e) => {
              debug(`Using proxy "${proxyHost}" for "${service.name}" (${service.id})`, e);
            });
          });
        });
      }
    },
  );
}

