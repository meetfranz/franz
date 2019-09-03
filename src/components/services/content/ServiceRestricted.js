import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { serviceLimitStore } from '../../../features/serviceLimit';
import Button from '../../ui/Button';
import { RESTRICTION_TYPES } from '../../../models/Service';

const messages = defineMessages({
  headlineServiceLimit: {
    id: 'service.restrictedHandler.serviceLimit.headline',
    defaultMessage: '!!!You have reached your service limit.',
  },
  textServiceLimit: {
    id: 'service.restrictedHandler.serviceLimit.text',
    defaultMessage: '!!!Please upgrade your account to use more than {count} services.',
  },
  headlineCustomUrl: {
    id: 'service.restrictedHandler.customUrl.headline',
    defaultMessage: '!!!Franz Professional Plan required',
  },
  textCustomUrl: {
    id: 'service.restrictedHandler.customUrl.text',
    defaultMessage: '!!!Please upgrade to the Franz Professional plan to use custom urls & self hosted services.',
  },
  action: {
    id: 'service.restrictedHandler.action',
    defaultMessage: '!!!Upgrade Account',
  },
});

export default @observer class ServiceRestricted extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    upgrade: PropTypes.func.isRequired,
    type: PropTypes.number.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  countdownInterval = null;

  countdownIntervalTimeout = 1000;

  render() {
    const {
      name,
      upgrade,
      type,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="services__info-layer">
        {type === RESTRICTION_TYPES.SERVICE_LIMIT && (
          <>
            <h1>{intl.formatMessage(messages.headlineServiceLimit)}</h1>
            <p>{intl.formatMessage(messages.textServiceLimit, { count: serviceLimitStore.serviceLimit })}</p>
          </>
        )}
        {type === RESTRICTION_TYPES.CUSTOM_URL && (
          <>
            <h1>{intl.formatMessage(messages.headlineCustomUrl)}</h1>
            <p>{intl.formatMessage(messages.textCustomUrl)}</p>
          </>
        )}
        <Button
          label={intl.formatMessage(messages.action, { name })}
          buttonType="inverted"
          onClick={() => upgrade()}
        />
      </div>
    );
  }
}
