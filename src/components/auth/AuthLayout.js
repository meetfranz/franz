import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { RouteTransition } from 'react-router-transition';
import { intlShape } from 'react-intl';

import Link from '../ui/Link';
import InfoBar from '../ui/InfoBar';

import { oneOrManyChildElements, globalError as globalErrorPropType } from '../../prop-types';
import globalMessages from '../../i18n/globalMessages';

@observer
export default class AuthLayout extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    pathname: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
    isOnline: PropTypes.bool.isRequired,
    isAPIHealthy: PropTypes.bool.isRequired,
    retryHealthCheck: PropTypes.func.isRequired,
    isHealthCheckLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      children,
      pathname,
      error,
      isOnline,
      isAPIHealthy,
      retryHealthCheck,
      isHealthCheckLoading,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="auth">
        {!isOnline && (
          <InfoBar
            type="warning"
          >
            <span className="mdi mdi-flash" />
            {intl.formatMessage(globalMessages.notConnectedToTheInternet)}
          </InfoBar>
        )}
        {isOnline && !isAPIHealthy && (
          <InfoBar
            type="danger"
            ctaLabel="Try again"
            ctaLoading={isHealthCheckLoading}
            sticky
            onClick={retryHealthCheck}
          >
            <span className="mdi mdi-flash" />
            {intl.formatMessage(globalMessages.APIUnhealthy)}
          </InfoBar>
        )}
        <div className="auth__layout">
          <RouteTransition
            pathname={pathname}
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            mapStyles={styles => ({
              transform: `translateX(${styles.translateX}%)`,
              opacity: styles.opacity,
            })}
            component="span"
          >
            {/* Inject globalError into children  */}
            {React.cloneElement(children, {
              error,
            })}
          </RouteTransition>
        </div>
        {/* </div> */}
        <Link to="https://adlk.io" className="auth__adlk" target="_blank">
          <img src="./assets/images/adlk.svg" alt="" />
        </Link>
      </div>
    );
  }
}
