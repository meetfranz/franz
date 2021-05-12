import classNames from 'classnames';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  modal: {
    width: '80%',
    maxWidth: 600,
    textAlign: 'center',
  },
  sourcesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  source: {
    width: '33%',
    color: theme.colorText,
    marginBottom: 40,

    '& $thumb': {
      border: [3, 'solid', 'transparent'],
      borderRadius: theme.borderRadius,
      transition: 'border 250ms',
    },

    '&:hover, &$active': {
      color: theme.brandPrimary,

      '& $thumb': {
        borderColor: theme.brandPrimary,
      },
    },
  },
  active: {},
  thumbContainer: {
    height: 'auto',
    position: 'relative',
  },
  thumb: {
    minWidth: 150,
    minHeight: 90,
    background: theme.colorBackground,
  },
  appIcon: {
    position: 'absolute',
    right: 4,
    bottom: -5,
    width: 30,
    height: 30,
  },
});

export default @injectSheet(styles) @observer class SourceItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    thumbnail: PropTypes.string.isRequired,
    appIcon: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    classes: PropTypes.any,
  }

  static defaultProps = {
    appIcon: null,
    classes: {},
  }

  render() {
    const {
      name, isActive, thumbnail, appIcon, onSelect, classes,
    } = this.props;
    return (
      <button // eslint-disable-next-line react/no-array-index-key
        className={classNames({
          [classes.source]: true,
          [classes.active]: isActive,
        })}
        type="button"
        onClick={() => {
          onSelect();
        }}
      >
        <div className={classes.thumbContainer}>
          <img src={thumbnail} alt="" className={classes.thumb} />
          {appIcon && <img src={appIcon} alt="" className={classes.appIcon} />}
        </div>
        <p>
          {name}
        </p>
      </button>
    );
  }
}
