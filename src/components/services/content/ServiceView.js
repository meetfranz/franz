import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import injectSheet from 'react-jss';
import ServiceModel from '../../../models/Service';
import WebviewLoader from '../../ui/WebviewLoader';
import WebviewCrashHandler from './WebviewCrashHandler';
import WebviewErrorHandler from './ErrorHandlers/WebviewErrorHandler';
import ServiceDisabled from './ServiceDisabled';
import ServiceRestricted from './ServiceRestricted';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
  },
};
export default @injectSheet(styles) @observer class ServiceView extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    reload: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    upgrade: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };


  render() {
    const {
      service,
      reload,
      edit,
      enable,
      upgrade,
      classes,
    } = this.props;

    if (!service.isServiceInterrupted && service.isEnabled) return null;

    return (
      <div className={classes.container}>
        {service.isEnabled && (
          <>
            {service.hasCrashed && (
              <WebviewCrashHandler
                name={service.recipe.name}
                reload={reload}
              />
            )}
            {service.isEnabled && service.isLoading && service.isFirstLoad && !service.isServiceAccessRestricted && (
              <WebviewLoader
                loaded={false}
                name={service.name}
              />
            )}
            {service.isError && (
              <WebviewErrorHandler
                name={service.recipe.name}
                errorMessage={service.errorMessage}
                reload={reload}
                edit={edit}
              />
            )}
          </>
        )}
        {!service.isEnabled ? (
          <ServiceDisabled
            name={service.recipe.name}
            enable={enable}
          />
        ) : service.isServiceAccessRestricted && (
        <ServiceRestricted
          name={service.recipe.name}
          upgrade={upgrade}
          type={service.restrictionType}
        />
        )}
        {/* {this.state.statusBarVisible && (
          <StatusBarTargetUrl text={this.state.targetUrl} />
        )} */}
      </div>
    );
  }
}
