import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';

import ServiceView from './ServiceView';
import Appear from '../../ui/effects/Appear';

const messages = defineMessages({
  welcome: {
    id: 'services.welcome',
    defaultMessage: '!!!Welcome to Ferdi',
  },
  getStarted: {
    id: 'services.getStarted',
    defaultMessage: '!!!Get started',
  },
});

export default @observer class Services extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
    handleIPCMessage: PropTypes.func.isRequired,
    openWindow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  };

  static defaultProps = {
    services: [],
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      services,
      handleIPCMessage,
      setWebviewReference,
      detachService,
      openWindow,
      reload,
      openSettings,
      update,
    } = this.props;
    const { intl } = this.context;
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
      <div className="services">
        {services.length === 0 && (
          <Appear
            timeout={1500}
            transitionName="slideUp"
          >
            <div className="services__no-service">
              <img src="./assets/images/logo.svg" alt="Logo" style={{ maxHeight: '50vh' }} />
              <h1>{intl.formatMessage(messages.welcome)}</h1>
              { !isLoggedIn && (
                <p>Please open settings, choose a Ferdi server and click "Login" in the bottom left corner.</p>
              ) }
              <Appear
                timeout={300}
                transitionName="slideUp"
              >
                <Link to={ isLoggedIn ? '/settings/services' : '/settings/app' } className="button">
                  { isLoggedIn ? intl.formatMessage(messages.getStarted) : 'Open settings' }
                </Link>
              </Appear>
            </div>
          </Appear>
        )}
        {services.map(service => (
          <ServiceView
            key={service.id}
            service={service}
            handleIPCMessage={handleIPCMessage}
            setWebviewReference={setWebviewReference}
            detachService={detachService}
            openWindow={openWindow}
            reload={() => reload({ serviceId: service.id })}
            edit={() => openSettings({ path: `services/edit/${service.id}` })}
            enable={() => update({
              serviceId: service.id,
              serviceData: {
                isEnabled: true,
              },
              redirect: false,
            })}
          />
        ))}
      </div>
    );
  }
}
