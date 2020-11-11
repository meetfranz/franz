import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { Button } from '@meetfranz/forms';
import { H1, Icon } from '@meetfranz/ui';

import {
  mdiHeart, mdiEmail, mdiFacebookBox, mdiTwitter, mdiLinkedinBox,
} from '@mdi/js';
import Modal from '../../components/ui/Modal';
import { state } from '.';
import { gaEvent } from '../../lib/analytics';
import ServicesStore from '../../stores/ServicesStore';

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
  modal: {
    width: '80%',
    maxWidth: 600,
    background: theme.styleTypes.primary.accent,
    textAlign: 'center',
    color: theme.styleTypes.primary.contrast,
  },
  heartContainer: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '100%',
    background: theme.brandDanger,
    padding: 20,
    width: 100,
    height: 100,
    margin: [-70, 'auto', 30],
  },
  heart: {
    fill: theme.styleTypes.primary.contrast,
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: '1em',
    marginTop: 30,
  },
  cta: {
    background: theme.styleTypes.primary.contrast,
    color: `${theme.styleTypes.primary.accent} !important`,

    '& svg': {
      fill: theme.styleTypes.primary.accent,
    },
  },
});

export default @injectSheet(styles) @inject('stores') @observer class ShareFranzModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  close() {
    state.isModalVisible = false;
  }

  render() {
    const { isModalVisible } = state;

    const {
      classes,
      stores,
    } = this.props;

    const serviceCount = stores.services.all.length;

    const { intl } = this.context;

    return (
      <Modal
        isOpen={isModalVisible}
        className={classes.modal}
        shouldCloseOnOverlayClick
        close={this.close.bind(this)}
      >
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
      </Modal>
    );
  }
}

ShareFranzModal.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
};
