import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { oneOrManyChildElements } from '../../../prop-types';

import UserStore from '../../../stores/UserStore';

import styles from './styles';
import { gaEvent } from '../../../lib/analytics';
import FeaturesStore from '../../../stores/FeaturesStore';

const messages = defineMessages({
  action: {
    id: 'premiumFeature.button.upgradeAccount',
    defaultMessage: '!!!Upgrade account',
  },
});

@inject('stores', 'actions') @injectSheet(styles) @observer
class PremiumFeatureContainer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    condition: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    gaEventInfo: PropTypes.shape({
      category: PropTypes.string.isRequired,
      event: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  };

  static defaultProps = {
    condition: null,
    gaEventInfo: null,
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
      gaEventInfo,
    } = this.props;

    const { intl } = this.context;

    let showWrapper = !!condition;

    if (condition === null) {
      showWrapper = !stores.user.data.isPremium;
    } else if (typeof condition === 'function') {
      showWrapper = condition({
        isPremium: stores.user.data.isPremium,
        features: stores.features.features,
      });
    }

    return showWrapper ? (
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <p className={classes.title}>Premium Feature</p>
          <button
            className={classes.actionButton}
            type="button"
            onClick={() => {
              actions.ui.openSettings({ path: 'user' });
              if (gaEventInfo) {
                const { category, event, label } = gaEventInfo;
                gaEvent(category, event, label);
              }
            }}
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
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PremiumFeatureContainer;
