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
    defaultMessage: '!!!Welcome to Franz',
  },
  getStarted: {
    id: 'services.getStarted',
    defaultMessage: '!!!Get started',
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
  };

  _confettiTimeout = null;

  componentDidMount() {
    this._confettiTimeout = window.setTimeout(() => {
      this.setState({
        showConfetti: false,
      });
    }, ms('8s'));
  }

  componentWillUnmount() {
    if (this._confettiTimeout) {
      clearTimeout(this._confettiTimeout);
    }
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
              <img src="./assets/images/logo.svg" alt="" />
              <h1>{intl.formatMessage(messages.welcome)}</h1>
              <Appear
                timeout={300}
                transitionName="slideUp"
              >
                <Link to="/settings/recipes" className="button">
                  {intl.formatMessage(messages.getStarted)}
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
