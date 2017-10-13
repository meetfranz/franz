import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';
import { debounce } from 'lodash';

@observer
export default class SearchInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    name: PropTypes.string,
    throttle: PropTypes.bool,
    throttleDelay: PropTypes.number,
  };

  static defaultProps = {
    value: '',
    defaultValue: '',
    className: '',
    name: uuidv1(),
    throttle: false,
    throttleDelay: 250,
    onChange: () => null,
    onReset: () => null,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || props.defaultValue,
    };

    this.throttledOnChange = debounce(this.throttledOnChange, this.props.throttleDelay);
  }

  onChange(e) {
    const { throttle, onChange } = this.props;
    const { value } = e.target;
    this.setState({ value });

    if (throttle) {
      e.persist();
      this.throttledOnChange(value);
    } else {
      onChange(value);
    }
  }

  onClick() {
    const { defaultValue } = this.props;
    const { value } = this.state;

    if (value === defaultValue) {
      this.setState({ value: '' });
    }

    this.input.focus();
  }

  onBlur() {
    const { defaultValue } = this.props;
    const { value } = this.state;

    if (value === '') {
      this.setState({ value: defaultValue });
    }
  }

  throttledOnChange(e) {
    const { onChange } = this.props;

    onChange(e);
  }

  reset() {
    const { defaultValue, onReset } = this.props;
    this.setState({ value: defaultValue });

    onReset();
  }

  input = null;

  render() {
    const { className, name, defaultValue } = this.props;
    const { value } = this.state;

    return (
      <div
        className={classnames([
          className,
          'search-input',
        ])}
      >
        <label
          htmlFor={name}
          className="mdi mdi-magnify"
          onClick={() => this.onClick()}
        />
        <input
          name={name}
          type="text"
          value={value}
          onChange={e => this.onChange(e)}
          onClick={() => this.onClick()}
          onBlur={() => this.onBlur()}
          ref={(ref) => { this.input = ref; }}
        />
        {value !== defaultValue && value.length > 0 && (
          <span
            className="mdi mdi-close-circle-outline"
            onClick={() => this.reset()}
          />
        )}
      </div>
    );
  }
}
