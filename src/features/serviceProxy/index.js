import { autorun, observable } from 'mobx';
import { remote } from 'electron';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

const { session } = remote;

const debug = require('debug')('Franz:feature:serviceProxy');

export const config = observable({
  isEnabled: DEFAULT_FEATURES_CONFIG.isServiceProxyEnabled,
  isPremium: DEFAULT_FEATURES_CONFIG.isServiceProxyPremiumFeature,
});

export default function init(stores) {
  debug('Initializing `serviceProxy` feature');

  autorun(() => {
    const { isServiceProxyEnabled, isServiceProxyPremiumFeature } = stores.features.features;

    config.isEnabled = isServiceProxyEnabled !== undefined ? isServiceProxyEnabled : DEFAULT_FEATURES_CONFIG.isServiceProxyEnabled;
    config.isPremium = isServiceProxyPremiumFeature !== undefined ? isServiceProxyPremiumFeature : DEFAULT_FEATURES_CONFIG.isServiceProxyPremiumFeature;

    const services = stores.services.all;
    const isPremiumUser = stores.user.data.isPremium;

    services.forEach((service) => {
      const s = session.fromPartition(`persist:service-${service.id}`);
      let proxyHost = 'direct://';

      if (config.isEnabled && (isPremiumUser || !config.isPremium)) {
        const serviceProxyConfig = stores.settings.proxy[service.id];

        if (serviceProxyConfig && serviceProxyConfig.isEnabled && serviceProxyConfig.host) {
          proxyHost = serviceProxyConfig.host;
        }
      }

      s.setProxy({ proxyRules: proxyHost }, (e) => {
        debug(`Using proxy "${proxyHost}" for "${service.name}" (${service.id})`, e);
      });
    });
  });
}

