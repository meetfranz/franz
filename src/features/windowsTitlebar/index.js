import { ipcRenderer } from 'electron';
import { TitleBar } from '@meetfranz/electron-react-titlebar';
import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import { WINDOWS_TITLEBAR_FETCH_MENU, WINDOWS_TITLEBAR_RESIZE } from '../../ipcChannels';
import { AppMenu } from '../../lib/Menu';
import { DEFAULT_WEB_CONTENTS_ID } from '../../config';

// const appMenu = new AppMenu();

// ipcRenderer.on(WINDOWS_TITLEBAR_FETCH_MENU, (e, data) => {
//   appMenu.update(data);
// });

// export const WindowsTitlebar = injectIntl(({ intl }) => {
//   console.log('intl', intl);
//   const [menu, setMenu] = useState();

//   appMenu.setIntl(intl);
//   appMenu.setUpdateCallback(setMenu);

//   useEffect(() => {
//     console.log('component did mount');
//     // ipcRenderer.sendTo(DEFAULT_WEB_CONTENTS_ID, WINDOWS_TITLEBAR_FETCH_MENU);
//   }, []);

//   if (!menu) {
//     return null;
//   }

//   return (
//     <TitleBar
//       menu={menu}
//       icon="assets/images/logo.svg"
//       onToggleMenuBar={(isClicked) => {
//         ipcRenderer.send(WINDOWS_TITLEBAR_RESIZE, {
//           height: isClicked ? window.outerHeight : 28,
//         });
//       }}
//     />
//   );
// });


export default class WindowsTitlebar extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  appMenu = new AppMenu()

  state = {
    menu: {},
  }

  componentDidMount() {
    console.log('component did mount');
    const { intl } = this.context;

    this.appMenu.setIntl(intl);
    this.appMenu.setUpdateCallback(menu => this.setState({ menu }));

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
