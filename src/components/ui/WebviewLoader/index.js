import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';

import FullscreenLoader from '../FullscreenLoader';
import styles from './styles';

const messages = defineMessages({
  loading: {
    id: 'service.webviewLoader.loading',
    defaultMessage: '!!!Loading',
  },
});

export default @observer @injectSheet(styles) class WebviewLoader extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes, name } = this.props;
    const { intl } = this.context;
    return (
      <FullscreenLoader
        className={classes.component}
        title={`${intl.formatMessage(messages.loading)} ${name}`}
      />
    );
  }
}
