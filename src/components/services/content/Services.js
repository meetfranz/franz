import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';
import Confetti from 'react-confetti';
import ms from 'ms';
import injectSheet from 'react-jss';

import { ipcRenderer } from 'electron';
import Appear from '../../ui/effects/Appear';
import { RESIZE_SERVICE_VIEWS } from '../../../ipcChannels';
import ServiceView from './ServiceView';
import { TODOS_RECIPE_ID } from '../../../features/todos';

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

export default @injectSheet(styles) @observer class Services extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray,
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

  serviceContainerRef = React.createRef()

  resizeObserver = new window.ResizeObserver(([element]) => {
    const bounds = element.target.getBoundingClientRect();

    ipcRenderer.send(RESIZE_SERVICE_VIEWS, {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    });
  });

  componentDidMount() {
    this._confettiTimeout = window.setTimeout(() => {
      this.setState({
        showConfetti: false,
      });
    }, ms('8s'));

    this.resizeObserver.observe(this.serviceContainerRef.current);
  }

  componentWillUnmount() {
    if (this._confettiTimeout) {
      clearTimeout(this._confettiTimeout);
    }
  }


  render() {
    const {
      services,
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
      <div className="services" ref={this.serviceContainerRef}>
        {(userHasCompletedSignup || hasActivatedTrial) && (
          // TODO: BW REWORK: move confetti to a layer on top of BrowserView
          <div className={classes.confettiContainer}>
            <Confetti
              width={window.width}
              height={window.height}
              numberOfPieces={showConfetti ? 200 : 0}
            />
          </div>
        )}
        {services.length === 0 ? (
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
        ) : services.filter(service => service.recipe.id !== TODOS_RECIPE_ID).map(service => (
          <ServiceView
            key={service.id}
            service={service}
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
