import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';

import { FeatureItem } from './FeatureItem';

const messages = defineMessages({
  unlimitedServices: {
    id: 'pricing.features.unlimitedServices',
    defaultMessage: '!!!Add unlimited services',
  },
  spellchecker: {
    id: 'pricing.features.spellchecker',
    defaultMessage: '!!!Spellchecker support',
  },
  workspaces: {
    id: 'pricing.features.workspaces',
    defaultMessage: '!!!Workspaces',
  },
  customWebsites: {
    id: 'pricing.features.customWebsites',
    defaultMessage: '!!!Add Custom Websites',
  },
  onPremise: {
    id: 'pricing.features.onPremise',
    defaultMessage: '!!!On-premise & other Hosted Services',
  },
  thirdPartyServices: {
    id: 'pricing.features.thirdPartyServices',
    defaultMessage: '!!!Install 3rd party services',
  },
  serviceProxies: {
    id: 'pricing.features.serviceProxies',
    defaultMessage: '!!!Service Proxies',
  },
  teamManagement: {
    id: 'pricing.features.teamManagement',
    defaultMessage: '!!!Team Management',
  },
  appDelays: {
    id: 'pricing.features.appDelays',
    defaultMessage: '!!!No Waiting Screens',
  },
  adFree: {
    id: 'pricing.features.adFree',
    defaultMessage: '!!!Forever ad-free',
  },
});

export class FeatureList extends Component {
  static propTypes = {
    className: PropTypes.string,
    featureClassName: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    featureClassName: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      className,
      featureClassName,
    } = this.props;
    const { intl } = this.context;

    return (
      <ul className={className}>
        <FeatureItem name={intl.formatMessage(messages.unlimitedServices)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.spellchecker)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.workspaces)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.customWebsites)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.onPremise)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.thirdPartyServices)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.serviceProxies)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.teamManagement)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.appDelays)} className={featureClassName} />
        <FeatureItem name={intl.formatMessage(messages.adFree)} className={featureClassName} />
      </ul>
    );
  }
}

export default FeatureList;
