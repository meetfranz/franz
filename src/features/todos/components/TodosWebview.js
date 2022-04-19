import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';

import { mdiCheckAll } from '@mdi/js';
import { ipcRenderer } from 'electron';
import { BrowserWindow } from '@electron/remote';
import { debounce } from 'lodash';
import Appear from '../../../components/ui/effects/Appear';
import UpgradeButton from '../../../components/ui/UpgradeButton';
import { RESIZE_TODO_VIEW } from '../../../ipcChannels';

const messages = defineMessages({
  premiumInfo: {
    id: 'feature.todos.premium.info',
    defaultMessage: '!!!Franz Todos are available to premium users now!',
  },
  upgradeCTA: {
    id: 'feature.todos.premium.upgrade',
    defaultMessage: '!!!Upgrade Account',
  },
  rolloutInfo: {
    id: 'feature.todos.premium.rollout',
    defaultMessage: '!!!Everyone else will have to wait a little longer.',
  },
});

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    position: 'relative',
    borderLeft: ({ isVisible }) => (isVisible ? [`2px solid ${theme.todos.todosLayer.borderLeftColor}`] : 0),
  },
  resizeHandler: {
    position: 'absolute',
    left: 0,
    marginLeft: -5,
    width: 10,
    zIndex: 400,
    cursor: 'col-resize',
  },
  dragIndicator: {
    position: 'absolute',
    left: 0,
    width: 5,
    zIndex: 400,
    background: theme.todos.dragIndicator.background,
  },
  premiumContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    margin: [0, 'auto'],
    textAlign: 'center',
  },
  premiumIcon: {
    marginBottom: 40,
    background: theme.styleTypes.primary.accent,
    fill: theme.styleTypes.primary.contrast,
    padding: 10,
    borderRadius: 10,
  },
  premiumCTA: {
    marginTop: 40,
  },
  isTodosServiceActive: {
    width: '100%',
    // position: 'absolute',
    right: 0,
    zIndex: 0,
  },
});

@injectSheet(styles) @observer
class TodosWebview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isTodosServiceActive: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    resize: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
    isTodosIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isSettingsRouteActive: PropTypes.bool.isRequired,
    activeTodosService: PropTypes.object.isRequired,
  };

  state = {
    isDragging: false,
    width: 300,
  };

  static contextTypes = {
    intl: intlShape,
  };

  resizeObserver = new window.ResizeObserver(() => {
    this.resizeBrowserView();
  });

  todosContainerRef = React.createRef();

  todosResizeContainerRef = React.createRef();

  windowResizeHandler = debounce(() => {
    this.resizeBrowserView();
  }, 50, {
    trailing: true,
  });

  componentWillMount() {
    const { width } = this.props;

    this.setState({
      width,
    });
  }

  componentDidMount() {
    this.todosContainerRef.current.addEventListener('mousemove', this.resizePanel.bind(this));
    this.todosContainerRef.current.addEventListener('mouseup', this.stopResize.bind(this));
    this.todosContainerRef.current.addEventListener('mouseleave', this.stopResize.bind(this));

    this.resizeObserver.observe(this.todosContainerRef.current);

    this.resizeBrowserView();

    window.addEventListener('resize', this.windowResizeHandler);
  }

  componentWillUnmount() {
    ipcRenderer.send(RESIZE_TODO_VIEW, {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    });

    window.removeEventListener('resize', this.windowResizeHandler);
  }

  startResize = (event) => {
    this.setState({
      isDragging: true,
      initialPos: event.clientX,
      delta: 0,
    });
  };

  resizePanel(e) {
    const { minWidth } = this.props;

    const {
      isDragging,
      initialPos,
    } = this.state;

    if (isDragging && Math.abs(e.clientX - window.innerWidth) > minWidth) {
      const delta = e.clientX - initialPos;

      this.setState({
        delta,
      });
    }
  }

  stopResize() {
    const {
      resize,
      minWidth,
    } = this.props;

    const {
      isDragging,
      delta,
      width,
    } = this.state;

    if (isDragging) {
      let newWidth = width + (delta < 0 ? Math.abs(delta) : -Math.abs(delta));

      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      this.setState({
        isDragging: false,
        delta: 0,
        width: newWidth,
      });

      resize(newWidth);
    }
  }

  resizeBrowserView() {
    if (this.todosResizeContainerRef.current) {
      const bounds = this.todosResizeContainerRef.current.getBoundingClientRect();

      ipcRenderer.send(RESIZE_TODO_VIEW, {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
      });
    }
  }


  render() {
    const {
      classes,
      isTodosServiceActive,
      isVisible,
      isTodosIncludedInCurrentPlan,
      isSettingsRouteActive,
      activeTodosService,
    } = this.props;

    const {
      width,
      delta,
      isDragging,
    } = this.state;

    const { intl } = this.context;

    let displayedWidth = isVisible && !isSettingsRouteActive ? width : 0;
    if (isTodosServiceActive) {
      displayedWidth = null;
    }

    return (
      <div
        className={classnames({
          [classes.root]: true,
          [classes.isTodosServiceActive]: !isSettingsRouteActive && isTodosServiceActive && (!activeTodosService.isServiceInterrupted && activeTodosService.isEnabled),
        })}
        style={{ width: displayedWidth }}
        onMouseUp={() => this.stopResize()}
        ref={this.todosContainerRef}
        id="todos-panel"
      >
        <div
          className={classes.resizeHandler}
          style={Object.assign({ left: delta }, isDragging ? { width: 600, marginLeft: -200 } : {})} // This hack is required as resizing with webviews beneath behaves quite bad
          onMouseDown={e => this.startResize(e)}
        />
        {isDragging && (
          <div
            className={classes.dragIndicator}
            style={{ left: delta }} // This hack is required as resizing with webviews beneath behaves quite bad
          />
        )}
        <div ref={this.todosResizeContainerRef} />
        {!isTodosIncludedInCurrentPlan && (
          <Appear>
            <div className={classes.premiumContainer}>
              <Icon icon={mdiCheckAll} className={classes.premiumIcon} size={4} />
              <p>{intl.formatMessage(messages.premiumInfo)}</p>
              <p>{intl.formatMessage(messages.rolloutInfo)}</p>
              <UpgradeButton
                className={classes.premiumCTA}
                gaEventInfo={{ category: 'Todos', event: 'upgrade' }}
                short
              />
            </div>
          </Appear>
        )}
      </div>
    );
  }
}

export default TodosWebview;
