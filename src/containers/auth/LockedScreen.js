import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Locked from '../../components/auth/Locked';
import SettingsStore from '../../stores/SettingsStore';
import { DEFAULT_LOCK_PASSWORD } from '../../config';

import { globalError as globalErrorPropType } from '../../prop-types';

export default @inject('stores', 'actions') @observer class LockedScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  state = {
    error: false,
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { password } = values;

    let correctPassword = this.props.stores.settings.all.app.lockedPassword;
    if (!correctPassword) {
      // Lock feature was enabled but no password was set
      // Use default lock password so user can exit
      correctPassword = DEFAULT_LOCK_PASSWORD;
    }

    if (String(password) === String(correctPassword)) {
      this.props.actions.settings.update({
        type: 'app',
        data: {
          locked: false,
        },
      });
    } else {
      this.setState({
        error: {
          code: 'invalid-credentials',
        },
      });
    }
  }

  render() {
    const { stores, error } = this.props;
    return (
      <Locked
        onSubmit={this.onSubmit}
        isSubmitting={stores.user.loginRequest.isExecuting}
        error={this.state.error || error}
      />
    );
  }
}

LockedScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
};
