import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';

export default @observer class Select extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    showLabel: true,
    disabled: false,
  };

  render() {
    const {
      field,
      className,
      showLabel,
      disabled,
    } = this.props;

    return (
      <div
        className={classnames({
          'franz-form__field': true,
          'has-error': field.error,
          'is-disabled': disabled,
          [`${className}`]: className,
        })}
      >
        {field.label && showLabel && (
          <label
            className="franz-form__label"
            htmlFor={field.name}
          >
            {field.label}
          </label>
        )}
        <select
          onChange={field.onChange}
          id={field.id}
          defaultValue={field.value}
          className="franz-form__select"
          disabled={field.disabled || disabled}
        >
          {field.options.map(type => (
            <option
              key={type.value}
              value={type.value}
              disabled={type.disabled}
            >
              {type.label}
            </option>
          ))}
        </select>
        {field.error && (
          <div
            className="franz-form__error"
          >
            {field.error}
          </div>
        )}
      </div>
    );
  }
}
