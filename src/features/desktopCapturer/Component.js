import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { H1 } from '@meetfranz/ui';

import { ipcRenderer } from 'electron';
import { Button } from '@meetfranz/forms';
import SourceItem from './sourceItem';
import Modal from '../../components/ui/Modal';
import { closeModal, shareSourceWithClientWebview, state } from '.';
import { REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY } from './config';
// import { gaEvent } from '../../lib/analytics';
import ServicesStore from '../../stores/ServicesStore';

const messages = defineMessages({
  headline: {
    id: 'feature.desktopCapturer.headline',
    defaultMessage: '!!!Choose what to share',
  },
  shareSourceTextDisabled: {
    id: 'feature.desktopCapturer.shareSourceTextDisabled',
    defaultMessage: '!!!Select source',
  },
  shareSourceText: {
    id: 'feature.desktopCapturer.shareSourceText',
    defaultMessage: '!!!Share {name}',
  },
});

const styles = {
  modal: {
    width: '80%',
    maxWidth: 600,
    textAlign: 'center',
  },
  headline: {
    textAlign: 'center',
  },
  sourcesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 40,
    maxHeight: 460,
    overflow: 'scroll',
  },
  cta: {
    width: '100%',
    marginTop: 40,
  },
};

export default @injectSheet(styles) @inject('stores') @observer class DesktopCapturerModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  async componentDidMount() {
    const sources = await ipcRenderer.invoke(REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY);
    state.sources = sources;

    if (!state.selectedSource && state.sources.length > 0) {
      state.selectedSource = state.sources.filter(source => source.displayId)[0].id;
    }
  }

  close() {
    state.isModalVisible = false;
    state.sources = [];
  }


  render() {
    const { isModalVisible, sources } = state;

    const {
      classes,
      // stores,
    } = this.props;

    const { intl } = this.context;

    const sharedSource = state.sources.find(source => source.id === state.selectedSource);

    return (
      <Modal
        isOpen={isModalVisible}
        className={classes.modal}
        shouldCloseOnOverlayClick
        close={() => closeModal()}
      >
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.headline)}
        </H1>
        <div className={classes.sourcesContainer}>
          {(sources.filter(source => source.displayId) || []).map(source => (
            <SourceItem
              key={source.id}
              name={source.name}
              isActive={source.id === state.selectedSource}
              thumbnail={source.thumbnail}
              appIcon={source.appIcon}
              onSelect={() => { state.selectedSource = source.id; }}
            />
          ))}
          {(sources.filter(source => !source.displayId) || []).map(source => (
            <SourceItem
              key={source.id}
              name={`${source.id} ${source.name}`}
              isActive={source.id === state.selectedSource}
              thumbnail={source.thumbnail}
              appIcon={source.appIcon}
              onSelect={() => { state.selectedSource = source.id; }}
            />
          ))}
        </div>
        <div>
          <Button
            label={sharedSource ? intl.formatMessage(messages.shareSourceText, { name: sharedSource.name }) : intl.formatMessage(messages.shareSourceTextDisabled)}
            className={classes.cta}
            onClick={() => {
              shareSourceWithClientWebview();
              closeModal();
            }}
          />
        </div>
      </Modal>
    );
  }
}

DesktopCapturerModal.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
};
