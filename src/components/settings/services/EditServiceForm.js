import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';
import normalizeUrl from 'normalize-url';

import Form from '../../../lib/Form';
import User from '../../../models/User';
import Recipe from '../../../models/Recipe';
import Service from '../../../models/Service';
import Tabs, { TabItem } from '../../ui/Tabs';
import Input from '../../ui/Input';
import Toggle from '../../ui/Toggle';
import Button from '../../ui/Button';

const messages = defineMessages({
  saveService: {
    id: 'settings.service.form.saveButton',
    defaultMessage: '!!!Save service',
  },
  deleteService: {
    id: 'settings.service.form.deleteButton',
    defaultMessage: '!!!Delete Service',
  },
  availableServices: {
    id: 'settings.service.form.availableServices',
    defaultMessage: '!!!Available services',
  },
  yourServices: {
    id: 'settings.service.form.yourServices',
    defaultMessage: '!!!Your services',
  },
  addServiceHeadline: {
    id: 'settings.service.form.addServiceHeadline',
    defaultMessage: '!!!Add {name}',
  },
  editServiceHeadline: {
    id: 'settings.service.form.editServiceHeadline',
    defaultMessage: '!!!Edit {name}',
  },
  tabHosted: {
    id: 'settings.service.form.tabHosted',
    defaultMessage: '!!!Hosted',
  },
  tabOnPremise: {
    id: 'settings.service.form.tabOnPremise',
    defaultMessage: '!!!Self hosted ⭐️',
  },
  customUrlValidationError: {
    id: 'settings.service.form.customUrlValidationError',
    defaultMessage: '!!!Could not validate custom {name} server.',
  },
  customUrlPremiumInfo: {
    id: 'settings.service.form.customUrlPremiumInfo',
    defaultMessage: '!!!To add self hosted services, you need a Franz Premium Supporter Account.',
  },
  customUrlUpgradeAccount: {
    id: 'settings.service.form.customUrlUpgradeAccount',
    defaultMessage: '!!!Upgrade your account',
  },
  indirectMessageInfo: {
    id: 'settings.service.form.indirectMessageInfo',
    defaultMessage: '!!!You will be notified about all new messages in a channel, not just @username, @channel, @here, ...',
  },
  isMutedInfo: {
    id: 'settings.service.form.isMutedInfo',
    defaultMessage: '!!!When disabled, all notification sounds and audio playback are muted',
  },
});

@observer
export default class EditServiceForm extends Component {
  static propTypes = {
    recipe: PropTypes.instanceOf(Recipe).isRequired,
    service(props, propName) {
      if (props.action === 'edit' && !(props[propName] instanceof Service)) {
        return new Error(`'${propName}'' is expected to be of type 'Service'
          when editing a Service`);
      }

      return null;
    },
    user: PropTypes.instanceOf(User).isRequired,
    action: PropTypes.string.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    service: {},
  };
  static contextTypes = {
    intl: intlShape,
  };

  state = {
    isValidatingCustomUrl: false,
  }

  submit(e) {
    const { recipe } = this.props;

    e.preventDefault();
    this.props.form.submit({
      onSuccess: async (form) => {
        const values = form.values();

        let isValid = true;

        if (recipe.validateUrl && values.customUrl) {
          this.setState({ isValidatingCustomUrl: true });
          try {
            values.customUrl = normalizeUrl(values.customUrl, { stripWWW: false });
            isValid = await recipe.validateUrl(values.customUrl);
          } catch (err) {
            console.warn('ValidateURL', err);
            isValid = false;
          }
        }

        if (isValid) {
          this.props.onSubmit(values);
        } else {
          form.invalidate('url-validation-error');
        }

        this.setState({ isValidatingCustomUrl: false });
      },
      onError: () => {},
    });
  }

  render() {
    const {
      recipe,
      service,
      action,
      user,
      form,
      isSaving,
      isDeleting,
      onDelete,
    } = this.props;
    const { intl } = this.context;

    const { isValidatingCustomUrl } = this.state;

    const deleteButton = isDeleting ? (
      <Button
        label={intl.formatMessage(messages.deleteService)}
        loaded={false}
        buttonType="secondary"
        className="settings__delete-button"
        disabled
      />
    ) : (
      <Button
        buttonType="danger"
        label={intl.formatMessage(messages.deleteService)}
        className="settings__delete-button"
        onClick={onDelete}
      />
    );

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {action === 'add' ? (
              <Link to="/settings/recipes">
                {intl.formatMessage(messages.availableServices)}
              </Link>
            ) : (
              <Link to="/settings/services">
                {intl.formatMessage(messages.yourServices)}
              </Link>
            )}
          </span>
          <span className="separator" />
          <span className="settings__header-item">
            {action === 'add' ? (
              intl.formatMessage(messages.addServiceHeadline, {
                name: recipe.name,
              })
            ) : (
              intl.formatMessage(messages.editServiceHeadline, {
                name: service.name !== '' ? service.name : recipe.name,
              })
            )}
          </span>
        </div>
        <div className="settings__body">
          <form onSubmit={e => this.submit(e)} id="form">
            <Input field={form.$('name')} focus />
            {(recipe.hasTeamId || recipe.hasCustomUrl) && (
              <Tabs
                active={service.customUrl ? 1 : 0}
              >
                {recipe.hasTeamId && (
                  <TabItem title={intl.formatMessage(messages.tabHosted)}>
                    <Input field={form.$('team')} suffix={recipe.urlInputSuffix} />
                  </TabItem>
                )}
                {recipe.hasCustomUrl && (
                  <TabItem title={intl.formatMessage(messages.tabOnPremise)}>
                    {user.isPremium || recipe.author.find(a => a.email === user.email) ? (
                      <div>
                        <Input field={form.$('customUrl')} />
                        {form.error === 'url-validation-error' && (
                          <p className="franz-form__error">
                            {intl.formatMessage(messages.customUrlValidationError, { name: recipe.name })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="center premium-info">
                        <p>{intl.formatMessage(messages.customUrlPremiumInfo)}</p>
                        <p>
                          <Link to="/settings/user" className="button">
                            {intl.formatMessage(messages.customUrlUpgradeAccount)}
                          </Link>
                        </p>
                      </div>
                    )}
                  </TabItem>
                )}
              </Tabs>
            )}
            <div className="settings__options">
              <Toggle field={form.$('isNotificationEnabled')} />
              {recipe.hasIndirectMessages && (
                <div>
                  <Toggle field={form.$('isIndirectMessageBadgeEnabled')} />
                  <p className="settings__help">
                    {intl.formatMessage(messages.indirectMessageInfo)}
                  </p>
                </div>
              )}
              <Toggle field={form.$('isMuted')} />
              <p className="settings__help">
                {intl.formatMessage(messages.isMutedInfo)}
              </p>
              <Toggle field={form.$('isEnabled')} />
            </div>
            {recipe.message && (
              <p className="settings__message">
                <span className="mdi mdi-information" />
                {recipe.message}
              </p>
            )}
          </form>
        </div>
        <div className="settings__controls">
          {/* Delete Button */}
          {action === 'edit' && deleteButton}

          {/* Save Button */}
          {isSaving || isValidatingCustomUrl ? (
            <Button
              type="submit"
              label={intl.formatMessage(messages.saveService)}
              loaded={false}
              buttonType="secondary"
              disabled
            />
          ) : (
            <Button
              type="submit"
              label={intl.formatMessage(messages.saveService)}
              htmlForm="form"
            />
          )}
        </div>
      </div>
    );
  }
}
