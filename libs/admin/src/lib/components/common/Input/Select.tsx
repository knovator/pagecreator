import React from 'react';
import classNames from 'classnames';
import { SelectProps } from '../../../types';

const Select = ({
  onChange,
  value,
  rest,
  label,
  error,
  options = [],
  size = 'base',
  className,
  disabled,
  required,
  wrapperClassName,
}: SelectProps) => {
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
      <select
        data-testid={`input-select-${label}`}
        value={value}
        onChange={onChange}
        className={classNames('khb_input', `khb_input-${size}`, className)}
        disabled={disabled}
        {...rest}
      >
        {options.map((option, index) => (
          <option value={option.value} key={index} data-testid="select-option">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default Select;
