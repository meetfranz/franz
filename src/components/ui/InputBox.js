import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';

import Button from './Button';

@observer
export default class InputBox extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onSave: PropTypes.func,
    name: PropTypes.string,
    autoFocus: PropTypes.bool,
    label: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    placeholder: '',
    className: '',
    name: uuidv1(),
    onChange: () => null,
    onReset: () => null,
    onSave: () => null,
    autoFocus: false,
    label: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      disabled: true,
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSave = this.onSave.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    if (autoFocus) {
      this.input.focus();
    }
  }

  onBlur() {
    this.setState({ disabled: true });
  }

  onChange(e) {
    const { onChange } = this.props;
    const { value } = e.target;
    this.setState({ value });

    onChange(value);
  }

  onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      this.onSave();
    }
  }

  onSave() {
    const { onSave } = this.props;
    const { value } = this.state;

    if (value.trim() !== '') {
      onSave(value);
    }
    this.reset();
  }

  reset() {
    const { onReset } = this.props;
    this.setState({ value: '' });

    onReset();
  }

  input = null;

  render() {
    const { className, name, placeholder, label } = this.props;
    const { value } = this.state;

    return (
      <div
        className={classnames([
          className,
          'edit-in-place',
        ])}
        onClick={() => {
          this.setState({ disabled: false });
          this.input.focus();
        }}
      >
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          // disabled={this.state.disabled}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          ref={(ref) => { this.input = ref; }}
        />
        <Button
          style={{ display: 'inline' }}
          label={label}
          onClick={this.onSave}
        />
      </div>
    );
  }
}
