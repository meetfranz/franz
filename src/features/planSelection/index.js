import { BrowserWindow, webContents } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { reaction } from 'mobx';
import { OVERLAY_OPEN, PLAN_SELECTION_GET_DATA, PLAN_SELECTION_TRIGGER_ACTION } from '../../ipcChannels';
import PlanSelectionStore from './store';

const debug = require('debug')('Franz:feature:planSelection');

export const GA_CATEGORY_PLAN_SELECTION = 'planSelection';

export const ACTIONS = {
  ACTIVATE_TRIAL: 'ACTIVATE_TRIAL',
  UPGRADE_ACCOUNT: 'UPGRADE_ACCOUNT',
  DOWNGRADE_ACCOUNT: 'DOWNGRADE_ACCOUNT',
};

export const planSelectionStore = new PlanSelectionStore();

export default function initPlanSelection(stores, actions) {
  const { user, features } = stores;
  stores.planSelection = planSelectionStore;

  // Toggle planSelection feature
  reaction(
    () => features.features.isPlanSelectionEnabled,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `planSelection` feature');
        planSelectionStore.start(stores, actions);

        debug('plan selection, show overlay');

        if (planSelectionStore.isFeatureActive && planSelectionStore.showPlanSelectionOverlay) {
          ipcRenderer.invoke(OVERLAY_OPEN, {
            route: '/plan-selection', modal: true,
          });

          ipcRenderer.on(PLAN_SELECTION_GET_DATA, (event) => {
            debug('requesting data');
            ipcRenderer.sendTo(event.senderId, PLAN_SELECTION_GET_DATA, {
              firstname: user.data.firstname,
              hadSubscription: user.data.hadSubscription,
              isSubscriptionExpired: user.team && user.team.state === 'expired' && !user.team.userHasDowngraded,
              isPersonalPlanAvailable: features.features.isPersonalPlanAvailable,
              pricingConfig: {
                ...JSON.parse(JSON.stringify(features.features.pricingConfig)),
              },
            });
          });

          ipcRenderer.on(PLAN_SELECTION_TRIGGER_ACTION, (event, action, data) => {
            if (action === ACTIONS.UPGRADE_ACCOUNT) {
              debug('upgrade account');
              actions.payment.upgradeAccount({
                planId: data.planId,
                overrideParent: event.senderId,
                onCloseWindow: async () => {
                  const planSelectionWindow = BrowserWindow.fromWebContents(webContents.fromId(event.senderId));

                  await user.getUserInfoRequest._promise;

                  if (user.isPremium) {
                    planSelectionWindow.close();
                  } else {
                    debug('user has not made any decision');
                  }
                },
              });
            } else if (action === ACTIONS.DOWNGRADE_ACCOUNT) {
              debug('downgrade account');
              actions.planSelection.downgradeAccount();
            } else if (action === ACTIONS.ACTIVATE_TRIAL) {
              debug('activate trial');
              actions.user.activateTrial({ planId: data.planId });
            }
          });
        }
      } else if (planSelectionStore.isFeatureActive) {
        debug('Disabling `planSelection` feature');
        planSelectionStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}
