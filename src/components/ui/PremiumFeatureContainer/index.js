import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { oneOrManyChildElements } from '../../../prop-types';

import styles from './styles';

const messages = defineMessages({
  action: {
    id: 'premiumFeature.button.upgradeAccount',
    defaultMessage: '!!!Upgrade account',
  },
});

export default @inject('actions') @injectSheet(styles) @observer class PremiumFeatureContainer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      children,
      actions,
    } = this.props;

    const { intl } = this.context;

    return (
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
    );
  }
}

PremiumFeatureContainer.wrappedComponent.propTypes = {
  children: oneOrManyChildElements.isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

