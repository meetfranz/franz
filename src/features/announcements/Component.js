import React, { Component } from 'react';
import marked from 'marked';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { themeSidebarWidth } from '@meetfranz/theme/lib/themes/legacy';
import state from './state';

const messages = defineMessages({
  headline: {
    id: 'feature.announcements.headline',
    defaultMessage: '!!!What\'s new in Franz {version}?',
  },
});

const styles = theme => ({
  container: {
    background: theme.colorBackground,
    position: 'absolute',
    top: 0,
    zIndex: 140,
    width: `calc(100% - ${themeSidebarWidth})`,
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
  },
  headline: {
    color: theme.colorHeadline,
    margin: [25, 0, 40],
    'max-width': 500,
    'text-align': 'center',
    'line-height': '1.3em',
  },
  body: {
    '& h3': {
      fontSize: '24px',
      margin: '1.5em 0 1em 0',
    },
    '& li': {
      marginBottom: '1em',
    },
  },
});


@inject('actions') @injectSheet(styles) @observer
class AnnouncementScreen extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes } = this.props;
    const { intl } = this.context;
    return (
      <div className={`${classes.container}`}>
        <h1 className={classes.headline}>
          {intl.formatMessage(messages.headline, { version: state.currentVersion })}
        </h1>
        <div
          className={classes.body}
          dangerouslySetInnerHTML={{
            __html: marked(state.announcement, { sanitize: true }),
          }}
        />
      </div>
    );
  }
}

export default AnnouncementScreen;
