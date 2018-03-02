import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';

@observer
export default class EditInPlace extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onSave: PropTypes.func,
    name: PropTypes.string,
    autoFocus: PropTypes.bool,
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
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      closed: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    if (autoFocus) {
      this.input.focus();
    }
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
      const value = this.state.value;
      if (value.trim() !== '') {
        this.props.onSave(value);
      }
      this.reset();
    }
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
          'edit-in-place',
        ])}
        // onClick={() => this.setState({ closed: false })}
      >
        <label
          htmlFor={name}
          className="mdi mdi-plus"
        />
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          // disabled={this.state.closed}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          ref={(ref) => { this.input = ref; }}
        />
      </div>
    );
  }
}
