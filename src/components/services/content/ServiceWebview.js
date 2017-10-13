import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import Webview from 'react-electron-web-view';
import classnames from 'classnames';

import ServiceModel from '../../../models/Service';

@observer
export default class ServiceWebview extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isActive: false,
  };

  state = {
    forceRepaint: false,
  };

  componentDidMount() {
    autorun(() => {
      if (this.props.service.isActive) {
        this.setState({ forceRepaint: true });
        setTimeout(() => {
          this.setState({ forceRepaint: false });
        }, 100);
      }
    });
  }

  webview = null;

  render() {
    const {
      service,
      setWebviewReference,
    } = this.props;

    const webviewClasses = classnames({
      services__webview: true,
      'is-active': service.isActive,
      'services__webview--force-repaint': this.state.forceRepaint,
    });

    return (
      <div className={webviewClasses}>
        <Webview
          ref={(element) => { this.webview = element; }}

          autosize
          src={service.url}
          preload="./webview/plugin.js"
          partition={`persist:service-${service.id}`}

          onDidAttach={() => setWebviewReference({
            serviceId: service.id,
            webview: this.webview.view,
          })}

          useragent={service.userAgent}

          disablewebsecurity
          allowpopups
        />
      </div>
    );
  }
}
