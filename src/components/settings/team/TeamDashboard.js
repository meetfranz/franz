import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import { Badge } from '@meetfranz/ui';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';
import globalMessages from '../../../i18n/globalMessages';
import UpgradeButton from '../../ui/UpgradeButton';

const messages = defineMessages({
  headline: {
    id: 'settings.team.headline',
    defaultMessage: '!!!Team',
  },
  contentHeadline: {
    id: 'settings.team.contentHeadline',
    defaultMessage: '!!!Franz for Teams',
  },
  intro: {
    id: 'settings.team.intro',
    defaultMessage: '!!!You and your team use Franz? You can now manage Premium subscriptions for as many colleagues, friends or family members as you want, all from within one account.',
  },
  copy: {
    id: 'settings.team.copy',
    defaultMessage: '!!!Franz for Teams gives you the option to invite co-workers to your team by sending them email invitations and manage their subscriptions in your account’s preferences. Don’t waste time setting up subscriptions for every team member individually, forget about multiple invoices and different billing cycles - one team to rule them all!',
  },
  manageButton: {
    id: 'settings.team.manageAction',
    defaultMessage: '!!!Manage your Team on meetfranz.com',
  },
  upgradeButton: {
    id: 'settings.team.upgradeAction',
    defaultMessage: '!!!Upgrade your Account',
  },
});

const styles = {
  cta: {
    margin: [40, 'auto'],
    height: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',

    '@media(min-width: 800px)': {
      flexDirection: 'row',
    },
  },
  content: {
    height: 'auto',
    order: 1,

    '@media(min-width: 800px)': {
      order: 0,
    },
  },
  image: {
    display: 'block',
    height: 150,
    order: 0,
    margin: [0, 'auto', 40, 'auto'],

    '@media(min-width: 800px)': {
      marginLeft: 40,
      order: 1,
    },
  },
  headline: {
    marginBottom: 0,
  },
  headlineWithSpacing: {
    marginBottom: 'inherit',
  },
  proRequired: {
    margin: [10, 0, 40],
    height: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    height: 'auto',
  },
};


export default @injectSheet(styles) @observer class TeamDashboard extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    userInfoRequestFailed: PropTypes.bool.isRequired,
    retryUserInfoRequest: PropTypes.func.isRequired,
    openTeamManagement: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isProUser: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      isLoading,
      userInfoRequestFailed,
      retryUserInfoRequest,
      openTeamManagement,
      isProUser,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          {isLoading && (
            <Loader />
          )}

          {!isLoading && userInfoRequestFailed && (
            <Infobox
              icon="alert"
              type="danger"
              ctaLabel={intl.formatMessage(messages.tryReloadUserInfoRequest)}
              ctaLoading={isLoading}
              ctaOnClick={retryUserInfoRequest}
            >
              {intl.formatMessage(messages.userInfoRequestFailed)}
            </Infobox>
          )}

          {!userInfoRequestFailed && (
            <>
              {!isLoading && (
                <>
                  <>
                    <h1 className={classnames({
                      [classes.headline]: true,
                      [classes.headlineWithSpacing]: isProUser,
                    })}
                    >
                      {intl.formatMessage(messages.contentHeadline)}

                    </h1>
                    {!isProUser && (
                      <Badge className={classes.proRequired}>{intl.formatMessage(globalMessages.proRequired)}</Badge>
                    )}
                    <div className={classes.container}>
                      <div className={classes.content}>
                        <p>{intl.formatMessage(messages.intro)}</p>
                        <p>{intl.formatMessage(messages.copy)}</p>
                      </div>
                      <img className={classes.image} src="https://cdn.franzinfra.com/announcements/assets/teams.png" alt="Franz for Teams" />
                    </div>
                    <div className={classes.buttonContainer}>
                      {!isProUser ? (
                        <UpgradeButton
                          className={classes.cta}
                          gaEventInfo={{ category: 'Todos', event: 'upgrade' }}
                          requiresPro
                          short
                        />
                      ) : (
                        <Button
                          label={intl.formatMessage(messages.manageButton)}
                          onClick={openTeamManagement}
                          className={classes.cta}
                        />
                      )}
                    </div>
                  </>
                </>
              )}
            </>
          )}
        </div>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}
