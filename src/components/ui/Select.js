import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';

@observer
export default class Select extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    focus: false,
    showLabel: true,
  };

  render() {
    const {
      field,
      className,
      showLabel,
    } = this.props;

    return (
      <div
        className={classnames({
          'franz-form__field': true,
          'has-error': field.error,
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
        >
          {field.options.map(type => (
            <option
              key={type.value}
              value={type.value}
              disabled={type.disabled}
              // selected={field.value === }
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
