import { ipcRenderer } from 'electron';
import { TitleBar } from '@meetfranz/electron-react-titlebar';
import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { WINDOWS_TITLEBAR_RESIZE } from '../../ipcChannels';
import { _titleBarTemplateFactory } from '../../lib/Menu';

export const WindowsTitlebar = injectIntl(({ intl }) => {
  const menu = _titleBarTemplateFactory(intl);

  // TODO: BW REWORK: rebuild build service, workspace and todos menu
  useEffect(() => {
    // ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, WINDOWS_TITLEBAR_GET_MENU);
    // ipcRenderer.once(WINDOWS_TITLEBAR_GET_MENU, (e, menuData) => {
    //   setMenu(menuData);
    // });
  }, []);

  if (!menu) {
    return null;
  }

  return (
    <TitleBar
      menu={menu}
      icon="assets/images/logo.svg"
      onToggleMenuBar={(isClicked) => {
        ipcRenderer.send(WINDOWS_TITLEBAR_RESIZE, {
          height: isClicked ? window.outerHeight : 28,
        });
      }}
    />
  );
});
