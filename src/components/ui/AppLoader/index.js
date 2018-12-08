import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import FullscreenLoader from '../FullscreenLoader';
import { shuffleArray } from '../../../helpers/array-helpers';

import styles from './styles';

const textList = shuffleArray([
  'Looking for Sisi',
  'Contacting the herald',
  'Saddling the unicorn',
  'Learning the Waltz',
  'Visiting Horst & Grete',
  'Twisting my moustache',
  'Playing the trumpet',
  'Traveling through space & time',
]);

export default @injectSheet(styles) class AppLoader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    step: 0,
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        step: this.state.step === textList.length - 1 ? 0 : this.state.step + 1,
      });
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  interval = null;

  render() {
    const { classes } = this.props;
    const { step } = this.state;

    return (
      <FullscreenLoader
        title="Franz"
        className={classes.component}
      >
        {textList.map((text, i) => (
          <span
            key={text}
            className={classnames({
              [`${classes.slogan}`]: true,
              [`${classes.visible}`]: step === i,
            })}
          >
            {text}
          </span>
        ))}
      </FullscreenLoader>
    );
  }
}

