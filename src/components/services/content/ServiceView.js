import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import ServiceModel from '../../../models/Service';
import StatusBarTargetUrl from '../../ui/StatusBarTargetUrl';
import WebviewLoader from '../../ui/WebviewLoader';
import WebviewCrashHandler from './WebviewCrashHandler';
import WebviewErrorHandler from './ErrorHandlers/WebviewErrorHandler';
import ServiceDisabled from './ServiceDisabled';
import ServiceRestricted from './ServiceRestricted';
import ServiceWebview from './ServiceWebview';
import WebControlsScreen from '../../../features/webControls/containers/WebControlsScreen';
import { CUSTOM_WEBSITE_ID } from '../../../features/webControls/constants';

export default @observer class ServiceView extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    upgrade: PropTypes.func.isRequired,
    isSpellcheckerEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isActive: false,
  };

  state = {
    forceRepaint: false,
    targetUrl: '',
    statusBarVisible: false,
  };

  autorunDisposer = null;

  forceRepaintTimeout = null;

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      if (this.props.service.isActive) {
        this.setState({ forceRepaint: true });
        this.forceRepaintTimeout = setTimeout(() => {
          this.setState({ forceRepaint: false });
        }, 100);
      }
    });
  }

  componentWillUnmount() {
    this.autorunDisposer();
    clearTimeout(this.forceRepaintTimeout);
  }

  updateTargetUrl = (event) => {
    let visible = true;
    if (event.url === '' || event.url === '#') {
      visible = false;
    }
    this.setState({
      targetUrl: event.url,
      statusBarVisible: visible,
    });
  };

  render() {
    const {
      detachService,
      service,
      setWebviewReference,
      reload,
      edit,
      enable,
      upgrade,
      isSpellcheckerEnabled,
    } = this.props;

    const webviewClasses = classnames({
      services__webview: true,
      'services__webview-wrapper': true,
      'is-active': service.isActive,
      'services__webview--force-repaint': this.state.forceRepaint,
    });

    let statusBar = null;
    if (this.state.statusBarVisible) {
      statusBar = (
        <StatusBarTargetUrl text={this.state.targetUrl} />
      );
    }

    return (
      <div className={webviewClasses}>
        {service.isActive && service.isEnabled && (
          <Fragment>
            {service.hasCrashed && (
              <WebviewCrashHandler
                name={service.recipe.name}
                webview={service.webview}
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
          </Fragment>
        )}
        {!service.isEnabled ? (
          <Fragment>
            {service.isActive && (
              <ServiceDisabled
                name={service.recipe.name}
                webview={service.webview}
                enable={enable}
              />
            )}
          </Fragment>
        ) : (
          <>
            {service.isServiceAccessRestricted ? (
              <ServiceRestricted
                name={service.recipe.name}
                upgrade={upgrade}
                type={service.restrictionType}
              />
            ) : (
              <>
                {service.recipe.id === CUSTOM_WEBSITE_ID && (
                  <WebControlsScreen service={service} />
                )}
                {!service.isHibernating && (
                  <ServiceWebview
                    service={service}
                    setWebviewReference={setWebviewReference}
                    detachService={detachService}
                    isSpellcheckerEnabled={isSpellcheckerEnabled}
                  />
                )}
              </>
            )}
          </>
        )}
        {statusBar}
      </div>
    );
  }
}
