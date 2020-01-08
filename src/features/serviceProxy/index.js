import { autorun, observable } from 'mobx';
import { remote } from 'electron';

import { DEFAULT_FEATURES_CONFIG } from '../../config';

const { session } = remote;

const debug = require('debug')('Franz:feature:serviceProxy');

export const config = observable({
  isEnabled: DEFAULT_FEATURES_CONFIG.isServiceProxyEnabled,
  isPremium: DEFAULT_FEATURES_CONFIG.isServiceProxyIncludedInCurrentPlan,
});

export default function init(stores) {
  debug('Initializing `serviceProxy` feature');

  autorun(() => {
    const { isServiceProxyEnabled, isServiceProxyIncludedInCurrentPlan } = stores.features.features;

    config.isEnabled = isServiceProxyEnabled !== undefined ? isServiceProxyEnabled : DEFAULT_FEATURES_CONFIG.isServiceProxyEnabled;
    config.isIncludedInCurrentPlan = isServiceProxyIncludedInCurrentPlan !== undefined ? isServiceProxyIncludedInCurrentPlan : DEFAULT_FEATURES_CONFIG.isServiceProxyIncludedInCurrentPlan;

    const services = stores.services.enabled;
    const isPremiumUser = stores.user.data.isPremium;
    const proxySettings = stores.settings.proxy;

    debug('Service Proxy autorun');

    services.forEach((service) => {
      const s = session.fromPartition(`persist:service-${service.id}`);

      if (config.isEnabled && (isPremiumUser || !config.isIncludedInCurrentPlan)) {
        const serviceProxyConfig = proxySettings[service.id];

        if (serviceProxyConfig && serviceProxyConfig.isEnabled && serviceProxyConfig.host) {
          const proxyHost = `${serviceProxyConfig.host}${serviceProxyConfig.port ? `:${serviceProxyConfig.port}` : ''}`;
          debug(`Setting proxy config from service settings for "${service.name}" (${service.id}) to`, proxyHost);

          s.setProxy({ proxyRules: proxyHost }, () => {
            debug(`Using proxy "${proxyHost}" for "${service.name}" (${service.id})`);
          });
        }
      }
    });
  });
}
