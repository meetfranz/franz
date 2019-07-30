import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import Webview from 'react-electron-web-view';
import * as environment from '../../../environment';

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    position: 'relative',
  },
  webview: {
    height: '100%',
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
});

@injectSheet(styles) @observer
class TodosWebview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    authToken: PropTypes.string.isRequired,
    resize: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
  };

  state = {
    isDragging: false,
    width: 300,
  }

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
  }

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

  render() {
    const { authToken, classes } = this.props;
    const { width, delta, isDragging } = this.state;

    return (
      <>
        <div
          className={classes.root}
          style={{ width }}
          onMouseUp={() => this.stopResize()}
          ref={(node) => { this.node = node; }}
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
          <Webview
            className={classes.webview}
            src={`${environment.TODOS_FRONTEND}?authToken=${authToken}`}
          />
        </div>
      </>
    );
  }
}

export default TodosWebview;
