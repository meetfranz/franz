import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { Button } from '@meetfranz/forms';
import { H1, Icon } from '@meetfranz/ui';

import {
  mdiHeart, mdiEmail, mdiFacebookBox, mdiTwitter, mdiLinkedinBox, mdiClose,
} from '@mdi/js';
import { ipcRenderer } from 'electron';
import { state } from '.';
import { gaEvent } from '../../lib/analytics';
import { DEFAULT_WEB_CONTENTS_ID } from '../../config';
import { SHARE_FRANZ_GET_SERVICE_COUNT } from '../../ipcChannels';
import service from '../../actions/service';

const messages = defineMessages({
  headline: {
    id: 'feature.shareFranz.headline',
    defaultMessage: '!!!Franz is better together!',
  },
  text: {
    id: 'feature.shareFranz.text',
    defaultMessage: '!!!Tell your friends and colleagues how awesome Franz is and help us to spread the word.',
  },
  actionsEmail: {
    id: 'feature.shareFranz.action.email',
    defaultMessage: '!!!Share as email',
  },
  actionsFacebook: {
    id: 'feature.shareFranz.action.facebook',
    defaultMessage: '!!!Share on Facebook',
  },
  actionsTwitter: {
    id: 'feature.shareFranz.action.twitter',
    defaultMessage: '!!!Share on Twitter',
  },
  actionsLinkedIn: {
    id: 'feature.shareFranz.action.linkedin',
    defaultMessage: '!!!Share on LinkedIn',
  },
  shareTextEmail: {
    id: 'feature.shareFranz.shareText.email',
    defaultMessage: '!!! I\'ve added {count} services to Franz! Get the free app for WhatsApp, Messenger, Slack, Skype and co at www.meetfranz.com',
  },
  shareTextTwitter: {
    id: 'feature.shareFranz.shareText.twitter',
    defaultMessage: '!!! I\'ve added {count} services to Franz! Get the free app for WhatsApp, Messenger, Slack, Skype and co at www.meetfranz.com /cc @FranzMessenger',
  },
});

const styles = theme => ({
  container: {
    position: 'relative',
    background: theme.styleTypes.primary.accent,
    borderRadius: theme.borderRadius,
    textAlign: 'center',
    color: theme.styleTypes.primary.contrast,
    paddingTop: 40,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    '& svg': {
      color: theme.styleTypes.primary.contrast,
      fill: theme.styleTypes.primary.contrast,
    },
  },
  heartContainer: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '100%',
    background: theme.brandDanger,
    padding: 20,
    width: 100,
    height: 100,
    margin: [0, 'auto', 30],
  },
  heart: {
    fill: theme.styleTypes.primary.contrast,
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
    color: theme.styleTypes.primary.contrast,
  },
  actions: {
    display: 'flex',
    gridGap: '1em',
    marginTop: 30,
    justifyContent: 'center',
  },
  cta: {
    background: theme.styleTypes.primary.contrast,
    color: `${theme.styleTypes.primary.accent} !important`,
    height: 50,

    '& svg': {
      fill: theme.styleTypes.primary.accent,
    },
  },
});

export default @injectSheet(styles) @observer class ShareFranzModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    serviceCount: 0,
  }

  componentDidMount() {
    ipcRenderer.on(SHARE_FRANZ_GET_SERVICE_COUNT, (event, { serviceCount }) => {
      this.setState({ serviceCount });
    });
    ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, SHARE_FRANZ_GET_SERVICE_COUNT);
  }

  close() {
    window.close();
    state.isModalVisible = true;
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      serviceCount,
    } = this.state;

    const { intl } = this.context;

    return (
      <div className={classes.container}>
        <button
          type="button"
          className={classes.close}
          onClick={this.close}
        >
          <Icon icon={mdiClose} size={1.5} />
        </button>
        <div className={classes.heartContainer}>
          <Icon icon={mdiHeart} className={classes.heart} size={4} />
        </div>
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.headline)}
        </H1>
        <p>{intl.formatMessage(messages.text)}</p>
        <div className={classes.actions}>
          <Button
            label={intl.formatMessage(messages.actionsEmail)}
            className={classes.cta}
            icon={mdiEmail}
            href={`mailto:?subject=Meet the cool app Franz&body=${intl.formatMessage(messages.shareTextEmail, { count: serviceCount })}}`}
            target="_blank"
            onClick={() => {
              gaEvent('Share Franz', 'share', 'Share via email');
            }}
          />
          <Button
            label={intl.formatMessage(messages.actionsFacebook)}
            className={classes.cta}
            icon={mdiFacebookBox}
            href="https://www.facebook.com/sharer/sharer.php?u=https://www.meetfranz.com?utm_source=facebook&utm_medium=referral&utm_campaign=share-button"
            target="_blank"
            onClick={() => {
              gaEvent('Share Franz', 'share', 'Share via Facebook');
            }}
          />
          <Button
            label={intl.formatMessage(messages.actionsLinkedIn)}
            className={classes.cta}
            icon={mdiLinkedinBox}
            href="https://www.linkedin.com/sharing/share-offsite/?url=https://meetfranz.com"
            target="_blank"
            onClick={() => {
              gaEvent('Share Franz', 'share', 'Share via LinkedIn');
            }}
          />
          <Button
            label={intl.formatMessage(messages.actionsTwitter)}
            className={classes.cta}
            icon={mdiTwitter}
            href={`https://twitter.com/intent/tweet?text=${intl.formatMessage(messages.shareTextTwitter, { count: serviceCount })}`}
            target="_blank"
            onClick={() => {
              gaEvent('Share Franz', 'share', 'Share via Twitter');
            }}
          />
        </div>
      </div>
    );
  }
}
