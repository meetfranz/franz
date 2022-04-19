import React, { Component, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { ipcRenderer } from 'electron';
import Appear from '../../ui/effects/Appear';
import { RESIZE_SERVICE_VIEWS } from '../../../ipcChannels';
import ServiceView from './ServiceView';

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
  container: {
    display: 'flex',
    flex: 1,

    '&>span': {
      display: 'block',
      width: '100%',
    },
  },
};

export default @injectSheet(styles) @observer class Services extends Component {
  static propTypes = {
    hideWelcomeView: PropTypes.bool.isRequired,
    activeService: PropTypes.object,
    serviceCount: PropTypes.number.isRequired,
    reload: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    activeService: undefined,
  }

  static contextTypes = {
    intl: intlShape,
  };

  componentWillUnmount() {
    if (this._confettiTimeout) {
      clearTimeout(this._confettiTimeout);
    }
  }

  render() {
    const {
      hideWelcomeView,
      activeService,
      serviceCount,
      reload,
      openSettings,
      update,
      classes,
    } = this.props;

    const { intl } = this.context;

    return (
      <>
        {serviceCount === 0 ? (
          <>
            {!hideWelcomeView && (
              <div className={classes.container}>
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
              </div>
            )}
          </>
        ) : (
          <>
            {activeService && (
              <ServiceView
                key={activeService.id}
                service={activeService}
                reload={() => reload({ serviceId: activeService.id })}
                edit={() => openSettings({ path: `services/edit/${activeService.id}` })}
                enable={() => update({
                  serviceId: activeService.id,
                  serviceData: {
                    isEnabled: true,
                  },
                  redirect: false,
                })}
                upgrade={() => openSettings({ path: 'user' })}
              />
            )}
            <ResizeBWServiceComponent />
          </>
        )}
      </>
    );
  }
}

const resizeObserver = new window.ResizeObserver(([element]) => {
  const bounds = element.target.getBoundingClientRect();

  ipcRenderer.send(RESIZE_SERVICE_VIEWS, {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: element.target.offsetTop,
  });
});

const ResizeBWServiceComponent = () => {
  const serviceContainerRef = useRef();

  useEffect(() => {
    resizeObserver.observe(serviceContainerRef.current);
  }, [serviceContainerRef]);

  return <div className="services" ref={serviceContainerRef} />;
};
