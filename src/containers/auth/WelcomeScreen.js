import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Welcome from '../../components/auth/Welcome';
import UserStore from '../../stores/UserStore';
import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import { gaPage } from '../../lib/analytics';

export default @inject('stores', 'actions') @observer class LoginScreen extends Component {
  componentDidMount() {
    gaPage('Auth/Welcome');
  }

  render() {
    const { user, recipePreviews } = this.props.stores;

    return (
      <Welcome
        loginRoute={user.loginRoute}
        signupRoute={user.signupRoute}
        recipes={recipePreviews.featured}
      />
    );
  }
}

LoginScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    recipePreviews: PropTypes.instanceOf(RecipePreviewsStore).isRequired,
  }).isRequired,
};
