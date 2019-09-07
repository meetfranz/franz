import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';
import Confetti from 'react-confetti';
import ms from 'ms';
import injectSheet from 'react-jss';

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
  login: {
    id: 'services.login',
    defaultMessage: '!!!Please login to use Ferdi.',
  },
  serverInfo: {
    id: 'services.serverInfo',
    defaultMessage: '!!!Optionally, you can change your Ferdi server by clicking the cog in the bottom left corner.',
  },
});


const styles = {
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    pointerEvents: 'none',
  },
};

export default @observer @injectSheet(styles) class Services extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
    handleIPCMessage: PropTypes.func.isRequired,
    openWindow: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    userHasCompletedSignup: PropTypes.bool.isRequired,
    hasActivatedTrial: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    services: [],
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    showConfetti: true,
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({
        showConfetti: false,
      });
    }, ms('8s'));
  }

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
      userHasCompletedSignup,
      hasActivatedTrial,
      classes,
    } = this.props;

    const {
      showConfetti,
    } = this.state;

    const { intl } = this.context;
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
      <div className="services">
        {(userHasCompletedSignup || hasActivatedTrial) && (
          <div className={classes.confettiContainer}>
            <Confetti
              width={window.width}
              height={window.height}
              numberOfPieces={showConfetti ? 200 : 0}
            />
          </div>
        )}
        {services.length === 0 && (
          <Appear
            timeout={1500}
            transitionName="slideUp"
          >
            <div className="services__no-service">
              <img src="./assets/images/logo.svg" alt="Logo" style={{ maxHeight: '50vh' }} />
              <h1>{intl.formatMessage(messages.welcome)}</h1>
              { !isLoggedIn && (
                <>
                  <p>{intl.formatMessage(messages.login)}</p>
                  <p>{intl.formatMessage(messages.serverInfo)}</p>
                </>
              ) }
              <Appear
                timeout={300}
                transitionName="slideUp"
              >
                <Link to={isLoggedIn ? '/settings/services' : '/auth/welcome'} className="button">
                  { isLoggedIn ? intl.formatMessage(messages.getStarted) : 'Login' }
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
            upgrade={() => openSettings({ path: 'user' })}
          />
        ))}
      </div>
    );
  }
}
