import { ipcRenderer } from 'electron';
import { TitleBar } from '@meetfranz/electron-react-titlebar';
import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import { WINDOWS_TITLEBAR_FETCH_MENU, WINDOWS_TITLEBAR_RESIZE } from '../../ipcChannels';
import { AppMenu } from '../../lib/Menu';
import { DEFAULT_WEB_CONTENTS_ID } from '../../config';

export default class WindowsTitlebar extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  appMenu = new AppMenu()

  componentDidMount() {
    console.log('component did mount');
    const { intl } = this.context;

    this.appMenu.setIntl(intl);

    ipcRenderer.on(WINDOWS_TITLEBAR_FETCH_MENU, (e, data) => {
      this.appMenu.update(data);
    });

    ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, WINDOWS_TITLEBAR_FETCH_MENU);
  }

  render() {
    return (
      <TitleBar
        menu={this.appMenu.menu}
        icon="assets/images/logo.svg"
        onToggleMenuBar={(isClicked) => {
          ipcRenderer.send(WINDOWS_TITLEBAR_RESIZE, {
            height: isClicked ? window.outerHeight : 28,
          });
        }}
      />
    );
  }
}
