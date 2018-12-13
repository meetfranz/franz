import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { oneOrManyChildElements } from '../../../prop-types';

import UserStore from '../../../stores/UserStore';

import styles from './styles';

const messages = defineMessages({
  action: {
    id: 'premiumFeature.button.upgradeAccount',
    defaultMessage: '!!!Upgrade account',
  },
});

export default @inject('stores', 'actions') @injectSheet(styles) @observer class PremiumFeatureContainer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    condition: PropTypes.bool,
  };

  static defaultProps = {
    condition: true,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      children,
      actions,
      condition,
      stores,
    } = this.props;

    const { intl } = this.context;

    return !stores.user.data.isPremium && !!condition ? (
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <p className={classes.title}>Premium Feature</p>
          <button
            className={classes.actionButton}
            type="button"
            onClick={() => actions.ui.openSettings({ path: 'user' })}
          >
            {intl.formatMessage(messages.action)}
          </button>
        </div>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    ) : children;
  }
}

PremiumFeatureContainer.wrappedComponent.propTypes = {
  children: oneOrManyChildElements.isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
