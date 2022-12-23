import React from 'react';
import classNames from 'classnames';
import { InputProps } from '../../../types';

const Input = ({
  label,
  id,
  placeholder,
  type,
  size = 'base',
  required,
  error,
  className,
  disabled,
  rest,
  onInput,
  onBlur,
  value,
  info,
  onChange,
  wrapperClassName,
}: InputProps) => {
  return (
    <div className={classNames('khb_input-wrapper', wrapperClassName)}>
      {label && (
        <label className="khb_input-label">
          {label}
          {required ? (
            <span className="khb_input-label-required">*</span>
          ) : null}
        </label>
      )}
      <input
        className={classNames('khb_input', `khb_input-${size}`, className)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
        value={value}
        onChange={onChange}
        {...rest}
        onInput={onInput}
        onBlur={onBlur}
      />
      {error && <p className="khb_input-error ">{error}</p>}
      {info && <p className="khb_input-info">{info}</p>}
    </div>
  );
};

export default Input;
