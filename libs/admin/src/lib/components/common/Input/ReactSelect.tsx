import React from 'react';
import classNames from 'classnames';
import ReactSelect from 'react-select/async';
import { ReactSelectProps } from '../../../types';

const CustomReactSelect = ({
  onChange,
  label,
  error,
  className,
  isMulti,
  selectedOptions = [],
  required,
  isLoading,
  isSearchable,
  loadOptions,
  placeholder,
  wrapperClassName,
  formatOptionLabel,
  listCode,
  customStyles,
  key,
}: ReactSelectProps) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="khb_input-label">
          {label}
          {required ? (
            <span className="khb_input-label-required">*</span>
          ) : null}
        </label>
      )}
      <ReactSelect
        key={key}
        data-testid={`input-select-${label}`}
        value={selectedOptions}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onChange}
        className={classNames(className)}
        isMulti={isMulti}
        defaultOptions
        isSearchable={isSearchable}
        isLoading={isLoading}
        loadOptions={loadOptions}
        placeholder={placeholder}
        formatOptionLabel={
          formatOptionLabel
            ? (option) => formatOptionLabel(listCode!, option)
            : undefined
        }
        styles={customStyles}
      />
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default CustomReactSelect;
