import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import classnames from 'classnames';
import pick from 'lodash/pick';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import htmlElementAttributes from 'react-html-attributes';
import injectSheet from 'react-jss';

import { IFormField, IWithStyle } from '../typings/generic';

import Error from '../error';
import Label from '../label';
import Wrapper from '../wrapper';
import scorePasswordFunc from './scorePassword';

import styles from './styles';

interface IProps extends IFormField, React.InputHTMLAttributes<HTMLInputElement>, IWithStyle {
  label: string;
  focus?: boolean;
  prefix?: string;
  suffix?: string;
  scorePassword?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
}

interface IState {
  showPassword: boolean;
  passwordScore: number;
}

@observer
class Input extends Component<IProps, IState> {
  public static defaultProps = {
    classes: {},
    focus: false,
    onChange: () => {},
    scorePassword: false,
    showLabel: true,
    showPasswordToggle: false,
    type: 'text',
  };

  state = {
    passwordScore: 0,
    showPassword: false,
  };

  private inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    const { focus } = this.props;

    if (focus && this.inputRef && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {
      scorePassword,
      onChange,
    } = this.props;

    if (onChange) {
      onChange(e);
    }

    if (this.inputRef && this.inputRef.current && scorePassword) {
      this.setState({ passwordScore: scorePasswordFunc(this.inputRef.current.value) });
    }
  }

  render() {
    const {
      classes,
      disabled,
      error,
      id,
      label,
      prefix,
      scorePassword,
      suffix,
      showLabel,
      showPasswordToggle,
      type,
    } = this.props;

    const {
      showPassword,
      passwordScore,
    } = this.state;

    const inputProps = pick(this.props, htmlElementAttributes['input']);

    if (type === 'password' && showPassword) {
      inputProps.type = 'text';
    }

    inputProps.onChange = this.onChange.bind(this);

    const cssClasses = classnames({
      [`${inputProps.className}`]: inputProps.className,
      [`${classes.input}`]: true,
    });

    return (
      <Wrapper>
        <Label
          title={label}
          showLabel={showLabel}
          htmlFor={id}
        >
          <div
            className={classnames({
              [`${classes.hasPasswordScore}`]: showPasswordToggle,
              [`${classes.wrapper}`]: true,
              [`${classes.disabled}`]: disabled,
              [`${classes.hasError}`]: error,
            })}>
            {prefix && (
              <span className={classes.prefix}>
                {prefix}
              </span>
            )}
            <input
              {...inputProps}
              className={cssClasses}
              ref={this.inputRef}
            />
            {suffix && (
              <span className={classes.suffix}>
                {suffix}
              </span>
            )}
            {showPasswordToggle && (
              <button
                type="button"
                className={classes.formModifier}
                onClick={() => this.setState(prevState => ({ showPassword: !prevState.showPassword }))}
                tabIndex={-1}
              >
                <Icon
                  path={!showPassword ? mdiEye : mdiEyeOff}
                  size={1}
                />
              </button>
            )}
          </div>
          {scorePassword && (
            <div className={classnames({
              [`${classes.passwordScore}`]: true,
              [`${classes.hasError}`]: error,
            })}>
              <meter
                value={passwordScore < 5 ? 5 : passwordScore}
                low={30}
                high={75}
                optimum={100}
                max={100}
              />
            </div>
          )}
        </Label>
        {error && (
          <Error message={error} />
        )}
      </Wrapper>
    );
  }
}

export default injectSheet(styles)(Input);
