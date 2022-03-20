import React, { Component } from 'react';
import { dialog, getCurrentWindow } from '@electron/remote';
import { defineMessages, intlShape } from 'react-intl';
import { ipcRenderer } from 'electron';

import PlanSelection from '../components/PlanSelection';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { ACTIONS, GA_CATEGORY_PLAN_SELECTION } from '..';
import { gaEvent, gaPage } from '../../../lib/analytics';
import { DEFAULT_WEB_CONTENTS_ID } from '../../../config';
import { PLAN_SELECTION_GET_DATA, PLAN_SELECTION_TRIGGER_ACTION } from '../../../ipcChannels';

const messages = defineMessages({
  dialogTitle: {
    id: 'feature.planSelection.fullscreen.dialog.title',
    defaultMessage: '!!!Downgrade your Franz Plan',
  },
  dialogMessage: {
    id: 'feature.planSelection.fullscreen.dialog.message',
    defaultMessage: '!!!You\'re about to downgrade to our Free account. Are you sure? Click here instead to get more services and functionality for just {currency}{price} a month.',
  },
  dialogCTADowngrade: {
    id: 'feature.planSelection.fullscreen.dialog.cta.downgrade',
    defaultMessage: '!!!Downgrade to Free',
  },
  dialogCTAUpgrade: {
    id: 'feature.planSelection.fullscreen.dialog.cta.upgrade',
    defaultMessage: '!!!Choose Personal',
  },
});

class PlanSelectionScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  state = {
    isLoading: true,
    firstname: '',
    hadSubscription: false,
    isSubscriptionExpired: false,
    isPersonalPlanAvailable: true,
    pricingConfig: {},
  }

  componentWillMount() {
    ipcRenderer.on(PLAN_SELECTION_GET_DATA, (event, data) => {
      this.setState(prevState => ({
        ...prevState,
        ...data,
        isLoading: false,
      }));
    });

    ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, PLAN_SELECTION_GET_DATA);
  }

  triggerAction(action, data) {
    ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, PLAN_SELECTION_TRIGGER_ACTION, action, data);
  }

  render() {
    const { intl } = this.context;

    const {
      firstname, isLoading, hadSubscription, isSubscriptionExpired, isPersonalPlanAvailable, pricingConfig,
    } = this.state;
    const { plans, currency } = pricingConfig;
    // const { activateTrial } = this.props.actions.user;
    // const { downgradeAccount, hideOverlay } = this.props.actions.planSelection;

    if (isLoading) return null;

    return (
      <ErrorBoundary>
        <PlanSelection
          firstname={firstname}
          plans={plans}
          currency={currency}
          upgradeAccount={(planId) => {
            if (hadSubscription) {
              this.triggerAction(ACTIONS.UPGRADE_ACCOUNT, { planId });

              gaEvent(GA_CATEGORY_PLAN_SELECTION, 'SelectPlan', planId);
            } else {
              this.triggerAction(ACTIONS.ACTIVATE_TRIAL, { planId });
            }
          }}
          stayOnFree={() => {
            gaPage('/select-plan/downgrade');

            const selection = dialog.showMessageBoxSync(getCurrentWindow(), {
              type: 'question',
              message: intl.formatMessage(messages.dialogTitle),
              detail: intl.formatMessage(messages.dialogMessage, {
                currency,
                price: plans.personal.yearly.price,
              }),
              buttons: [
                intl.formatMessage(messages.dialogCTADowngrade),
                intl.formatMessage(messages.dialogCTAUpgrade),
              ],
            });

            gaEvent(GA_CATEGORY_PLAN_SELECTION, 'SelectPlan', 'Stay on Free');

            if (selection === 0) {
              this.triggerAction(ACTIONS.DOWNGRADE_ACCOUNT);

              window.close();
              gaEvent(GA_CATEGORY_PLAN_SELECTION, 'SelectPlan', 'Downgrade');
            } else {
              this.triggerAction(ACTIONS.UPGRADE_ACCOUNT, { planId: plans.personal.yearly.id });

              gaEvent(GA_CATEGORY_PLAN_SELECTION, 'SelectPlan', 'Upgrade');
            }
          }}
          subscriptionExpired={isSubscriptionExpired}
          hadSubscription={hadSubscription}
          isPersonalPlanAvailable={isPersonalPlanAvailable}
        />
      </ErrorBoundary>
    );
  }
}

export default PlanSelectionScreen;
