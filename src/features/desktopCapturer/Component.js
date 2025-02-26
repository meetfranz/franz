import { Button } from '@meetfranz/forms';
import { H1 } from '@meetfranz/ui';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { state } from '.';
import { RELAY_DESKTOP_CAPTURER_SOURCES_IPC_KEY, REQUEST_DESKTOP_CAPTURER_SOURCES_IPC_KEY } from './config';
import SourceItem from './sourceItem';

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
  cancel: {
    id: 'feature.desktopCapturer.cancelSourceSelection',
    defaultMessage: '!!!Cancel',
  },
});

const styles = theme => ({
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 40,
  },
  headline: {
    textAlign: 'center',
  },
  sourcesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 20,
    overflow: 'scroll',
  },
  cta: {
    width: '100%',
    marginTop: 40,
  },
  cancelCta: {
    marginTop: 15,
    color: theme.colorText,
  },
});

export default @injectSheet(styles) @observer class DesktopCapturerModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
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
    state.sources = [];
  }


  render() {
    const { sources } = state;

    const {
      classes,
      params,
    } = this.props;

    console.log(this.props);

    const { intl } = this.context;

    const sharedSource = state.sources.find(source => source.id === state.selectedSource);

    return (
      <div className={classes.container}>
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
              name={source.name}
              isActive={source.id === state.selectedSource}
              thumbnail={source.thumbnail}
              appIcon={source.appIcon}
              onSelect={() => { state.selectedSource = source.id; }}
            />
          ))}
        </div>
        <Button
          label={sharedSource ? intl.formatMessage(messages.shareSourceText, { name: sharedSource.name }) : intl.formatMessage(messages.shareSourceTextDisabled)}
          className={classes.cta}
          onClick={() => {
            ipcRenderer.send(RELAY_DESKTOP_CAPTURER_SOURCES_IPC_KEY, {
              webContentsId: parseInt(params.webContentsId, 10),
              sourceId: state.selectedSource,
            });

            // We need to delay closing this a bit until the ipc calls have been finished
            setTimeout(() => {
              window.close();
            }, 10);
          }}
        />
        <button type="button" onClick={() => window.close()} className={classes.cancelCta}>{intl.formatMessage(messages.cancel)}</button>
      </div>
    );
  }
}
