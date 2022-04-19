import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import {
  sendCredentials,
  cancelLogin,
} from '.';
import Form from './Form';

import styles from './styles';

export default @injectSheet(styles) @observer class BasicAuthModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

   params = new URL(window.location.href).searchParams

   submit(e) {
     e.preventDefault();

     const values = Form.values();

     sendCredentials(values.user, values.password);
     this.close();
   }

   cancel() {
     cancelLogin();
     this.close();
   }

   close() {
     window.close();
   }

   render() {
     const {
       classes,
     } = this.props;

     console.log('seas', this.params.get('scheme'));

     if (!this.params.get('scheme')) {
       return null;
     }

     return (
       <div className={classes.container}>
         <h1>Sign in</h1>
         <p>
          http
           {this.params.get('port') === 443 && 's'}
          ://
           {this.params.get('host')}
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
       </div>
     );
   }
}
