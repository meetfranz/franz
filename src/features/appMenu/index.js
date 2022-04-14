import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { inject, observer } from 'mobx-react';
import { intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';
import { mdiDotsVertical } from '@mdi/js';
import { windowsTitleBarHeight } from '../../theme/default/legacy';
import { AppMenu } from '../../lib/Menu';
import AppStore from '../../stores/AppStore';
import SettingsStore from '../../stores/SettingsStore';

export const APP_MENU_ACKNOWLEDGED_KEY = 'appMenuBarAcknowledged';

const styles = theme => ({
  root: {
    height: parseInt(windowsTitleBarHeight, 10),
    display: 'flex',
    paddingLeft: 4,
    alignItems: 'center',
    WebkitAppRegion: 'drag',
  },
  brandIcon: {
    width: 18,
    marginRight: 8,
    transition: '0.4s all',
  },
  brand: {
    letterSpacing: '-0.2px',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.borderRadius,
    color: theme.colorText,
    padding: [0, 4, 0, 4],
    marginRight: 10,
    position: 'relative',
    WebkitAppRegion: 'no-drag',

    '& $menuIcon': {},

    '&:hover': {
      background: theme.styleTypes.secondary.accent,
      color: theme.styleTypes.secondary.contrast,
      transition: '0.25s all',

      '& svg': {
        fill: theme.styleTypes.secondary.contrast,
      },

      '& $brandIcon': {
        transform: 'rotateY(180deg)',
      },
    },
  },
  menuIcon: {
    marginLeft: 4,
    marginTop: 1,
  },
  newFeatureBubble: {
    width: 6,
    height: 6,
    background: theme.styleTypes.danger.accent,
    position: 'absolute',
    borderRadius: 6,
    right: 0,
    top: 0,
    boxShadow: `0px 0px 1px 1px ${theme.styleTypes.danger.accent}`,
  },
});

@inject('stores', 'actions') @injectSheet(styles) @observer
class AppMenuBar extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  state = {
    menuVisible: false,
  }

  appMenu = null;

  buttonRef = React.createRef();

  buildMenu(intl) {
    const {
      app,
    } = this.props.stores;

    this.appMenu = new AppMenu({
      intl,
      data: app.menuData,
      onShow: () => this.setState({ menuVisible: true }),
      onClose: () => this.setState({ menuVisible: false }),
    });
  }

  toggleMenu(intl) {
    if (!this.state.menuVisible) {
      this.buildMenu(intl);

      const buttonPos = this.buttonRef.current.getBoundingClientRect();

      this.appMenu.menu.popup({
        x: parseInt(buttonPos.x, 10),
        y: parseInt(buttonPos.y + buttonPos.height + 10, 10),
      });
    }

    this.props.actions.settings.update({
      type: 'app',
      data: {
        [APP_MENU_ACKNOWLEDGED_KEY]: true,
      },
    });

    this.setState(prevState => ({ menuVisible: !prevState.menuVisible }));
  }

  render() {
    const {
      // eslint-disable-next-line react/prop-types
      classes,
      stores: {
        settings: {
          app: appSettings,
        },
      },
    } = this.props;

    const { intl } = this.context;

    return (
      <div
        className={`appMenuBar ${classes.root}`}
      >
        <button type="button" className={classes.menuButton} onClick={() => this.toggleMenu(intl)} ref={this.buttonRef}>
          <img src="./assets/images/logo.svg" alt="" className={classes.brandIcon} />
          <span className={classes.brand}>Franz</span>
          <Icon icon={mdiDotsVertical} className={classes.menuIcon} />
          {!appSettings[APP_MENU_ACKNOWLEDGED_KEY] && (
            <span className={`${classes.newFeatureBubble} pulsating`} />
          )}
        </button>
      </div>
    );
  }
}

AppMenuBar.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AppMenuBar;
