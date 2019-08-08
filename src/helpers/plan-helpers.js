import { defineMessages } from 'react-intl';
import { PLANS_MAPPING, PLANS } from '../config';

const messages = defineMessages({
  [PLANS.PRO_YEARLY]: {
    id: 'pricing.plan.pro-yearly',
    defaultMessage: '!!!Franz Professional Yearly',
  },
  [PLANS.PRO_MONTHLY]: {
    id: 'pricing.plan.pro-monthly',
    defaultMessage: '!!!Franz Professional Monthly',
  },
  [PLANS.PERSONAL_YEARLY]: {
    id: 'pricing.plan.personal-yearly',
    defaultMessage: '!!!Franz Personal Yearly',
  },
  [PLANS.PERSONAL_MONTHLY]: {
    id: 'pricing.plan.personal-monthly',
    defaultMessage: '!!!Franz Personal Monthly',
  },
  [PLANS.FREE]: {
    id: 'pricing.plan.free',
    defaultMessage: '!!!Franz Free',
  },
  [PLANS.LEGACY]: {
    id: 'pricing.plan.legacy',
    defaultMessage: '!!!Franz Premium',
  },
});

export function i18nPlanName(planId, intl) {
  if (!planId) {
    throw new Error('planId is required');
  }

  if (!intl) {
    throw new Error('intl context is required');
  }

  const plan = PLANS_MAPPING[planId];

  return intl.formatMessage(messages[plan]);
}
