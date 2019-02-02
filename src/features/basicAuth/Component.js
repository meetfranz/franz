import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import {
  state,
  resetState,
  sendCredentials,
  cancelLogin,
} from '.';
import Form from './Form';

import styles from './styles';

export default @injectSheet(styles) @observer class BasicAuthModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  submit(e) {
    e.preventDefault();

    const values = Form.values();
    console.log('form submit', values);

    sendCredentials(values.user, values.password);
    resetState();
  }

  cancel() {
    cancelLogin();
    this.close();
  }

  close() {
    resetState();
    state.isModalVisible = false;
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      isModalVisible,
      authInfo,
    } = state;

    if (!authInfo) {
      return null;
    }

    return (
      <Modal
        isOpen={isModalVisible}
        className={classes.modal}
        close={this.cancel.bind(this)}
      >
        <h1>Sign in</h1>
        <p>
          http
          {authInfo.port === 443 && 's'}
          ://
          {authInfo.host}
        </p>
        <form
          onSubmit={this.submit.bind(this)}
          className={classnames('franz-form', classes.form)}
        >
          <Input
            field={Form.$('user')}
            showLabel={false}
          />
          <Input
            field={Form.$('password')}
            showLabel={false}
            showPasswordToggle
          />
          <div className={classes.buttons}>
            <Button
              type="button"
              label="Cancel"
              buttonType="secondary"
              onClick={this.cancel.bind(this)}
            />
            <Button
              type="submit"
              label="Sign In"
            />
          </div>
        </form>
      </Modal>
    );
  }
}
