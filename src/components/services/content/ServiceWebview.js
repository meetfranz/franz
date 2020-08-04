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
    isSpellcheckerEnabled: PropTypes.bool.isRequired,
  };

  webview = null;

  componentWillUnmount() {
    const { service, detachService } = this.props;
    detachService({ service });
  }

  refocusWebview = () => {
    const { webview } = this;
    if (!webview) return;
    webview.view.blur();
    webview.view.focus();
  };

  render() {
    const {
      service,
      setWebviewReference,
      isSpellcheckerEnabled,
    } = this.props;

    return (
      <ElectronWebView
        ref={(webview) => {
          this.webview = webview;
          if (webview && webview.view) {
            webview.view.addEventListener('did-stop-loading', this.refocusWebview);
          }
        }}
        autosize
        src={service.url}
        preload="./webview/recipe.js"
        partition={service.partition}
        onDidAttach={() => {
          setWebviewReference({
            serviceId: service.id,
            webview: this.webview.view,
          });
        }}
        onUpdateTargetUrl={this.updateTargetUrl}
        useragent={service.userAgent}
        disablewebsecurity={service.recipe.disablewebsecurity}
        allowpopups
        webpreferences={`spellcheck=${isSpellcheckerEnabled ? 1 : 0}`}
      />
    );
  }
}

export default ServiceWebview;
