import React from 'react';
import classNames from 'classnames';
import ReactSelect from 'react-select/async';
import { ReactSelectProps } from '../../../types';

type StyleFunction = (provided: Record<string, unknown>, state: unknown) => Record<string, unknown>;
type StylesConfig = Record<string, StyleFunction>;

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
  isClearable,
  loadOptions,
  placeholder,
  wrapperClassName,
  formatOptionLabel,
  listCode,
  customStyles,
  selectKey,
  disabled,
}: ReactSelectProps) => {
  // Default styles with text-sm for placeholder and selected values
  const defaultStyles: Partial<StylesConfig> = {
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm (14px)
    }),
    singleValue: (provided: Record<string, unknown>) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm (14px)
    }),
    multiValue: (provided: Record<string, unknown>) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm (14px)
    }),
    input: (provided: Record<string, unknown>) => ({
      ...provided,
      fontSize: '0.875rem', // text-sm (14px)
    }),
  };

  // Merge custom styles with default styles
  const mergedStyles = customStyles
    ? Object.keys(defaultStyles).reduce((acc: Record<string, StyleFunction>, key: string) => {
        acc[key] = (provided: Record<string, unknown>, state: unknown) => {
          const defaultStyle = (defaultStyles as Record<string, StyleFunction>)[key](provided, state);
          const customStyle = customStyles[key as keyof typeof customStyles]
            ? (customStyles[key as keyof typeof customStyles] as StyleFunction)(provided, state)
            : {};
          return { ...defaultStyle, ...customStyle };
        };
        return acc;
      }, {})
    : defaultStyles;

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
        key={selectKey}
        data-testid={`input-select-${label}`}
        value={selectedOptions}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={onChange}
        className={classNames(className)}
        isMulti={isMulti}
        isClearable={isClearable}
        defaultOptions
        isSearchable={isSearchable}
        isLoading={isLoading}
        isDisabled={disabled}
        loadOptions={loadOptions}
        placeholder={placeholder}
        formatOptionLabel={
          formatOptionLabel && listCode !== 'pages' && listCode !== 'blog'
            ? (option: { [key: string]: any }) =>
              formatOptionLabel(listCode!, option)
            : undefined
        }
        styles={mergedStyles}
      />
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default CustomReactSelect;
