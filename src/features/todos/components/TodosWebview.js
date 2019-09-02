import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import Webview from 'react-electron-web-view';
import { Icon } from '@meetfranz/ui';

import * as environment from '../../../environment';

const OPEN_TODOS_BUTTON_SIZE = 45;
const CLOSE_TODOS_BUTTON_SIZE = 35;

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    position: 'relative',
    borderLeft: [1, 'solid', theme.todos.todosLayer.borderLeftColor],
    zIndex: 300,

    transform: ({ isVisible, width }) => `translateX(${isVisible ? 0 : width}px)`,

    '&:hover $closeTodosButton': {
      opacity: 1,
    },
  },
  webview: {
    height: '100%',

    '& webview': {
      height: '100%',
    },
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
  openTodosButton: {
    width: OPEN_TODOS_BUTTON_SIZE,
    height: OPEN_TODOS_BUTTON_SIZE,
    background: theme.todos.toggleButton.background,
    position: 'absolute',
    bottom: 80,
    right: props => (props.width + (props.isVisible ? -OPEN_TODOS_BUTTON_SIZE / 2 : 0)),
    borderRadius: OPEN_TODOS_BUTTON_SIZE / 2,
    opacity: props => (props.isVisible ? 0 : 1),
    transition: 'right 0.5s',
    zIndex: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [0, 0, 10, theme.todos.toggleButton.shadowColor],

    borderTopRightRadius: props => (props.isVisible ? null : 0),
    borderBottomRightRadius: props => (props.isVisible ? null : 0),

    '& svg': {
      fill: theme.todos.toggleButton.textColor,
      transition: 'all 0.5s',
    },
  },
  closeTodosButton: {
    width: CLOSE_TODOS_BUTTON_SIZE,
    height: CLOSE_TODOS_BUTTON_SIZE,
    background: theme.todos.toggleButton.background,
    position: 'absolute',
    bottom: 80,
    right: ({ width }) => (width + -CLOSE_TODOS_BUTTON_SIZE / 2),
    borderRadius: CLOSE_TODOS_BUTTON_SIZE / 2,
    opacity: 0,
    transition: 'opacity 0.5s',
    zIndex: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [0, 0, 10, theme.todos.toggleButton.shadowColor],

    '& svg': {
      fill: theme.todos.toggleButton.textColor,
    },
  },
});

@injectSheet(styles) @observer
class TodosWebview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    togglePanel: PropTypes.func.isRequired,
    handleClientMessage: PropTypes.func.isRequired,
    setTodosWebview: PropTypes.func.isRequired,
    resize: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
  };

  state = {
    isDragging: false,
    width: 300,
  };

  componentWillMount() {
    const { width } = this.props;

    this.setState({
      width,
    });
  }

  componentDidMount() {
    this.node.addEventListener('mousemove', this.resizePanel.bind(this));
    this.node.addEventListener('mouseup', this.stopResize.bind(this));
    this.node.addEventListener('mouseleave', this.stopResize.bind(this));
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

  startListeningToIpcMessages() {
    const { handleClientMessage } = this.props;
    if (!this.webview) return;
    this.webview.addEventListener('ipc-message', e => handleClientMessage(e.args[0]));
  }

  render() {
    const {
      classes, isVisible, togglePanel,
    } = this.props;
    const { width, delta, isDragging } = this.state;

    return (
      <>
        <div
          className={classes.root}
          style={{ width: isVisible ? width : 0 }}
          onMouseUp={() => this.stopResize()}
          ref={(node) => { this.node = node; }}
        >
          <button
            onClick={() => togglePanel()}
            className={isVisible ? classes.closeTodosButton : classes.openTodosButton}
            type="button"
          >
            <Icon icon={isVisible ? 'mdiChevronRight' : 'mdiCheckAll'} size={2} />
          </button>
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
          <Webview
            className={classes.webview}
            onDidAttach={() => {
              const { setTodosWebview } = this.props;
              setTodosWebview(this.webview);
              this.startListeningToIpcMessages();
            }}
            partition="persist:todos"
            preload="./features/todos/preload.js"
            ref={(webview) => { this.webview = webview ? webview.view : null; }}
            src={environment.TODOS_FRONTEND}
          />
        </div>
      </>
    );
  }
}

export default TodosWebview;
