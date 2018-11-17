import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Link from '../ui/Link';

const messages = defineMessages({
  signupButton: {
    id: 'welcome.signupButton',
    defaultMessage: '!!!Create a free account',
  },
  loginButton: {
    id: 'welcome.loginButton',
    defaultMessage: '!!!Login to your account',
  },
});

export default @observer class Login extends Component {
  static propTypes = {
    loginRoute: PropTypes.string.isRequired,
    signupRoute: PropTypes.string.isRequired,
    recipes: MobxPropTypes.arrayOrObservableArray.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { intl } = this.context;
    const {
      loginRoute,
      signupRoute,
      recipes,
    } = this.props;

    return (
      <div className="welcome">
        <div className="welcome__content">
          <img src="./assets/images/logo.svg" className="welcome__logo" alt="" />
          {/* <img src="./assets/images/welcome.png" className="welcome__services" alt="" /> */}
          <div className="welcome__text">
            <h1>Franz</h1>
          </div>
        </div>
        <div className="welcome__buttons">
          <Link to={signupRoute} className="button button__inverted">
            {intl.formatMessage(messages.signupButton)}
          </Link>
          <Link to={loginRoute} className="button">
            {intl.formatMessage(messages.loginButton)}
          </Link>
        </div>
        <div className="welcome__featured-services">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="welcome__featured-service"
            >
              <img
                key={recipe.id}
                src={recipe.icons.svg}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
