import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SubscriptionPopup from '../../components/subscription/SubscriptionPopup';
import { isDevMode } from '../../environment';


export default class SubscriptionPopupScreen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = {
    complete: false,
  };

  completeCheck(event) {
    const { url } = event;

    if ((url.includes('recurly') && url.includes('confirmation')) || ((url.includes('meetfranz') || isDevMode) && url.includes('success'))) {
      this.setState({
        complete: true,
      });
    }
  }

  render() {
    return (
      <SubscriptionPopup
        url={this.props.params.url}
        closeWindow={() => window.close()}
        completeCheck={e => this.completeCheck(e)}
        isCompleted={this.state.complete}
      />
    );
  }
}
