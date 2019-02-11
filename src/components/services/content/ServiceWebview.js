import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import Webview from 'react-electron-web-view';
import classnames from 'classnames';

import ServiceModel from '../../../models/Service';
import StatusBarTargetUrl from '../../ui/StatusBarTargetUrl';
import WebviewLoader from '../../ui/WebviewLoader';
import WebviewCrashHandler from './WebviewCrashHandler';
import WebviewErrorHandler from './ErrorHandlers/WebviewErrorHandler';
import ServiceDisabled from './ServiceDisabled';

export default @observer class ServiceWebview extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
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

  webview = null;

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      if (this.props.service.isActive) {
        this.setState({ forceRepaint: true });
        setTimeout(() => {
          this.setState({ forceRepaint: false });
        }, 100);
      }
    });
  }

  componentWillUnmount() {
    this.autorunDisposer();
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
  }

  render() {
    const {
      service,
      setWebviewReference,
      reload,
      edit,
      enable,
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
            {service.isEnabled && service.isLoading && service.isFirstLoad && (
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
          <Webview
            ref={(element) => { this.webview = element; }}
            autosize
            src={service.url}
            preload="./webview/recipe.js"
            partition={`persist:service-${service.id}`}
            onDidAttach={() => setWebviewReference({
              serviceId: service.id,
              webview: this.webview.view,
            })}
            onUpdateTargetUrl={this.updateTargetUrl}
            useragent={service.userAgent}
            allowpopups
          />
        )}
        {statusBar}
      </div>
    );
  }
}
