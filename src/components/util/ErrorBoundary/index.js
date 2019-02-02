import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';

import Button from '../../ui/Button';

import styles from './styles';

const messages = defineMessages({
  headline: {
    id: 'app.errorHandler.headline',
    defaultMessage: '!!!Something went wrong.',
  },
  action: {
    id: 'app.errorHandler.action',
    defaultMessage: '!!!Reload',
  },
});

export default @injectSheet(styles) class ErrorBoundary extends Component {
  state = {
    hasError: false,
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  static contextTypes = {
    intl: intlShape,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { classes } = this.props;
    const { intl } = this.context;

    if (this.state.hasError) {
      return (
        <div className={classes.component}>
          <h1 className={classes.title}>
            {intl.formatMessage(messages.headline)}
          </h1>
          <Button
            label={intl.formatMessage(messages.action)}
            buttonType="inverted"
            onClick={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
