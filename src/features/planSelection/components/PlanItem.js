import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import color from 'color';

import { H2 } from '@meetfranz/ui';

import { Button } from '@meetfranz/forms';
import { mdiArrowRight } from '@mdi/js';
// import { FeatureList } from '../ui/FeatureList';
// import { PLANS, PAYMENT_INTERVAL } from '../../config';
// import { i18nPlanName, i18nIntervalName } from '../../helpers/plan-helpers';
// import { PLAN_INTERVAL_CONFIG_TYPE } from './types';

const messages = defineMessages({
  perMonth: {
    id: 'subscription.interval.perMonth',
    defaultMessage: '!!!per month',
  },
  perMonthPerUser: {
    id: 'subscription.interval.perMonthPerUser',
    defaultMessage: '!!!per month & user',
  },
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.borderRadius,
    flex: 1,
    color: theme.styleTypes.primary.accent,
    overflow: 'hidden',
    textAlign: 'center',

    '& h2': {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 30,
      color: theme.styleTypes.primary.contrast,
      // fontWeight: 'bold',
    },
  },
  currency: {
    fontSize: 35,
  },
  priceWrapper: {
    height: 50,
  },
  price: {
    fontSize: 50,

    '& sup': {
      fontSize: 20,
      verticalAlign: 20,
    },
  },
  interval: {
    // paddingBottom: 40,
  },
  text: {
    marginBottom: 'auto',
  },
  cta: {
    background: theme.styleTypes.primary.accent,
    color: theme.styleTypes.primary.contrast,
    margin: [40, 'auto', 0, 'auto'],

    // '&:active': {
    //   opacity: 0.7,
    // },
  },
  divider: {
    width: 40,
    border: 0,
    borderTop: [1, 'solid', theme.styleTypes.primary.contrast],
    margin: [30, 'auto'],
  },
  header: {
    padding: 20,
    background: color(theme.styleTypes.primary.accent).darken(0.25).hex(),
    color: theme.styleTypes.primary.contrast,
  },
  content: {
    padding: 20,
    // border: [1, 'solid', 'red'],
    background: '#EFEFEF',
  },
  simpleCTA: {
    background: 'none',
    color: theme.styleTypes.primary.accent,

    '& svg': {
      fill: theme.styleTypes.primary.accent,
    },
  },
});


export default @observer @injectSheet(styles) class PlanItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    upgrade: PropTypes.func.isRequired,
    ctaLabel: PropTypes.string.isRequired,
    simpleCTA: PropTypes.bool,
    perUser: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    children: PropTypes.element,
  };

  static defaultProps = {
    simpleCTA: false,
    perUser: false,
    children: null,
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      name,
      text,
      price,
      currency,
      classes,
      upgrade,
      ctaLabel,
      simpleCTA,
      perUser,
      children,
    } = this.props;
    const { intl } = this.context;

    const priceParts = `${price}`.split('.');
    // const intervalName = i18nIntervalName(PAYMENT_INTERVAL.MONTHLY, intl);

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <H2 className={classes.planName}>{name}</H2>
          <p className={classes.text}>
            {text}
          </p>
          <hr className={classes.divider} />
          <p className={classes.priceWrapper}>
            <span className={classes.currency}>{currency}</span>
            <span className={classes.price}>
              {priceParts[0]}
              <sup>{priceParts[1]}</sup>
            </span>
          </p>
          <p className={classes.interval}>
            {intl.formatMessage(perUser ? messages.perMonthPerUser : messages.perMonth)}
          </p>
        </div>

        <div className={classes.content}>
          {children}

          <Button
            className={classnames({
              [classes.cta]: true,
              [classes.simpleCTA]: simpleCTA,
            })}
            icon={simpleCTA ? mdiArrowRight : null}
            label={(
              <>
                {ctaLabel}
              </>
            )}
            onClick={upgrade}
          />
        </div>

      </div>
    );
  }
}
