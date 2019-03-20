import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ElectronWebView from 'react-electron-web-view';

import ServiceModel from '../../../models/Service';

@observer
class ServiceWebview extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
  };

  webview = null;

  componentWillUnmount() {
    const { service, detachService } = this.props;
    detachService({ service });
  }

  render() {
    const {
      service,
      setWebviewReference,
    } = this.props;

    return (
      <ElectronWebView
        ref={(webview) => { this.webview = webview; }}
        autosize
        src={service.url}
        preload="./webview/recipe.js"
        partition={`persist:service-${service.id}`}
        onDidAttach={() => {
          setWebviewReference({
            serviceId: service.id,
            webview: this.webview.view,
          });
        }}
        onUpdateTargetUrl={this.updateTargetUrl}
        useragent={service.userAgent}
        allowpopups
      />
    );
  }
}

export default ServiceWebview;
