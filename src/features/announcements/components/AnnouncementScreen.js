import React, { Component } from 'react';
import marked from 'marked';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { Button } from '@meetfranz/forms';

import { announcementsStore } from '../index';
import UIStore from '../../../stores/UIStore';

const messages = defineMessages({
  headline: {
    id: 'feature.announcements.changelog.headline',
    defaultMessage: '!!!Changes in Franz {version}',
  },
});

const smallScreen = '1000px';

const styles = theme => ({
  container: {
    background: theme.colorBackground,
    position: 'absolute',
    top: 0,
    zIndex: 140,
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  headline: {
    color: theme.colorHeadline,
    margin: [25, 0, 40],
    'max-width': 500,
    'text-align': 'center',
    'line-height': '1.3em',
  },
  announcement: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  main: {
    flexGrow: 1,
    '& h1': {
      marginTop: 40,
      fontSize: 50,
      color: theme.styleTypes.primary.accent,
      textAlign: 'center',
      [`@media(min-width: ${smallScreen})`]: {
        marginTop: 75,
      },
    },
    '& h2': {
      fontSize: 24,
      fontWeight: 300,
      color: theme.colorText,
      textAlign: 'center',
    },
  },
  mainBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(100% - 80px)',
    height: 'auto',
    margin: '0 auto',
    [`@media(min-width: ${smallScreen})`]: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  },
  mainImage: {
    minWidth: 250,
    maxWidth: 400,
    margin: '0 auto',
    marginBottom: 40,
    '& img': {
      width: '100%',
    },
    [`@media(min-width: ${smallScreen})`]: {
      margin: 0,
    },
  },
  mainText: {
    height: 'auto',
    maxWidth: 600,
    textAlign: 'center',
    '& p': {
      lineHeight: '1.5em',
    },
    [`@media(min-width: ${smallScreen})`]: {
      textAlign: 'left',
    },
  },
  mainCtaButton: {
    textAlign: 'center',
    marginTop: 40,
    [`@media(min-width: ${smallScreen})`]: {
      textAlign: 'left',
    },
  },
  spotlight: {
    height: 'auto',
  },
  changelog: {
    '& h3': {
      fontSize: '24px',
      margin: '1.5em 0 1em 0',
    },
    '& li': {
      marginBottom: '1em',
    },
  },
});


@inject('stores', 'actions') @injectSheet(styles) @observer
class AnnouncementScreen extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    stores: PropTypes.shape({
      ui: PropTypes.instanceOf(UIStore).isRequired,
    }).isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes, stores } = this.props;
    const { intl } = this.context;
    const { changelog, announcement } = announcementsStore;
    const themeImage = stores.ui.isDarkThemeActive ? 'dark' : 'light';
    return (
      <div className={`${classes.container}`}>
        <div className={classes.announcement}>
          <div className={classes.main}>
            <h1>{announcement.main.headline}</h1>
            <h2>{announcement.main.subHeadline}</h2>
            <div className={classes.mainBody}>
              <div className={classes.mainImage}>
                <img
                  src={announcement.main.image[themeImage]}
                  alt=""
                />
              </div>
              <div className={classes.mainText}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: marked(announcement.main.text,{ sanitize: true }),
                  }}
                />
                <div className={classes.mainCtaButton}>
                  <Button label={announcement.main.cta.label} />
                </div>
              </div>
            </div>
          </div>
          {announcement.spotlight && (
            <div className={classes.spotlight}>
              <h2>{announcement.spotlight.title}</h2>
            </div>
          )}
        </div>
        {changelog && (
          <div className={classes.changelog}>
            <h1 className={classes.headline}>
              {intl.formatMessage(messages.headline, {
                version: announcementsStore.currentVersion,
              })}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: marked(changelog, { sanitize: true }),
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default AnnouncementScreen;
