import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import { oneOrManyChildElements } from './prop-types';
import translations from './i18n/translations';
import UserStore from './stores/UserStore';

@inject('stores') @observer
export default class I18N extends Component {
  componentDidUpdate() {
    window.franz.menu.rebuild();
  }

  render() {
    const { stores, children } = this.props;
    const { locale } = stores.app;
    return (
      <IntlProvider
        {...{ locale, key: locale, messages: translations[locale] }}
        ref={(intlProvider) => { window.franz.intl = intlProvider ? intlProvider.getChildContext().intl : null; }}
      >
        {children}
      </IntlProvider>
    );
  }
}

I18N.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  children: oneOrManyChildElements.isRequired,
};
