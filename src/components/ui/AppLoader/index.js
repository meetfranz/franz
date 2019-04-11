import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet, { withTheme } from 'react-jss';
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

export default @injectSheet(styles) @withTheme class AppLoader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  state = {
    step: 0,
  };

  interval = null;

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        step: prevState.step === textList.length - 1 ? 0 : prevState.step + 1,
      }));
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes, theme } = this.props;
    const { step } = this.state;

    return (
      <FullscreenLoader
        title="Franz"
        className={classes.component}
        spinnerColor={theme.colorAppLoaderSpinner}
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
