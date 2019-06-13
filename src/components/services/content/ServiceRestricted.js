import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { serviceLimitStore } from '../../../features/serviceLimit';
import Button from '../../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'service.restrictedHandler.headline',
    defaultMessage: '!!!You have reached your service limit.',
  },
  text: {
    id: 'service.restrictedHandler.text',
    defaultMessage: '!!!Please upgrade your account to use more than {count} services.',
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
  };

  static contextTypes = {
    intl: intlShape,
  };

  countdownInterval = null;

  countdownIntervalTimeout = 1000;

  render() {
    const { name, upgrade } = this.props;
    const { intl } = this.context;

    return (
      <div className="services__info-layer">
        <h1>{intl.formatMessage(messages.headline)}</h1>
        <p>{intl.formatMessage(messages.text, { count: serviceLimitStore.serviceLimit })}</p>
        <Button
          label={intl.formatMessage(messages.action, { name })}
          buttonType="inverted"
          onClick={() => upgrade()}
        />
      </div>
    );
  }
}
