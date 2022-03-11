import { ipcRenderer } from 'electron';
import { TitleBar } from '@meetfranz/electron-react-titlebar';
import React, { useEffect, useState } from 'react';
import { DEFAULT_WEB_CONTENTS_ID } from '../../config';
import { WINDOWS_TITLEBAR_GET_MENU, WINDOWS_TITLEBAR_RESIZE } from '../../ipcChannels';

export const WindowsTitlebar = () => {
  const [menu, setMenu] = useState();
  useEffect(() => {
    ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, WINDOWS_TITLEBAR_GET_MENU);
    ipcRenderer.once(WINDOWS_TITLEBAR_GET_MENU, (e, menuData) => {
      setMenu(menuData);
    });
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
      // showWindowControls={false}
    />
  );
};
