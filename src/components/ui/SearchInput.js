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
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    name: PropTypes.string,
    throttle: PropTypes.bool,
    throttleDelay: PropTypes.number,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    placeholder: '',
    className: '',
    name: uuidv1(),
    throttle: false,
    throttleDelay: 250,
    onChange: () => null,
    onReset: () => null,
    autoFocus: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.throttledOnChange = debounce(this.throttledOnChange, this.props.throttleDelay);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    if (autoFocus) {
      this.input.focus();
    }
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

  throttledOnChange(e) {
    const { onChange } = this.props;

    onChange(e);
  }

  reset() {
    const { onReset } = this.props;
    this.setState({ value: '' });

    onReset();
  }

  input = null;

  render() {
    const { className, name, placeholder } = this.props;
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
        />
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => this.onChange(e)}
          ref={(ref) => { this.input = ref; }}
        />
        {value.length > 0 && (
          <span
            className="mdi mdi-close-circle-outline"
            onClick={() => this.reset()}
          />
        )}
      </div>
    );
  }
}
