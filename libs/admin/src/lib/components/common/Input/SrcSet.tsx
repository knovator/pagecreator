import React from 'react';
import classNames from 'classnames';
import { useFieldArray } from 'react-hook-form';
import Close from '../../../icons/close';
import Plus from '../../../icons/plus';
import { InputProps, InputSizes, SrcSetMessageProps } from '../../../types';

const SrcSetInput = ({
  size,
  className,
  rest,
  error,
  placeholder,
  disabled = false,
}: {
  size: InputSizes;
  rest: any;
  index: number;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  return (
    <div>
      <input
        className={classNames('khb_input', `khb_input-${size}`, className)}
        type={'number'}
        placeholder={placeholder}
        disabled={disabled}
        {...(rest || {})}
      />
      {error && <p className="khb_input-error">{error}</p>}
    </div>
  );
};

const SrcSet = ({
  label,
  size = 'base',
  required,
  error,
  className,
  register,
  wrapperClassName,
  control,
  errors,
  name,
  disabled = false,

  screenSizeRequired,
  heightRequired,
  minHeight,
  minScreenSize,
  minWidth,
  widthRequired,
}: InputProps & SrcSetMessageProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name!,
  });

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
      <div className="khb_input-srcset-items">
        {fields?.map((item, index) => (
          <div key={index} className="khb_input-srcset">
            <SrcSetInput
              error={errors?.[index]?.['screenSize']?.message?.toString()}
              index={index}
              className={className}
              size={size}
              placeholder="Screen Size"
              rest={register(`${name}.${index}.screenSize`, {
                required: screenSizeRequired,
                validate: (value: string) =>
                  Number(value) <= 0 ? minScreenSize : true,
              })}
              disabled={disabled}
            />

            <span className="p-2">=</span>
            <SrcSetInput
              error={errors?.[index]?.['width']?.message?.toString()}
              index={index}
              rest={register(`${name}.${index}.width`, {
                required: widthRequired,
                validate: (value: string) =>
                  Number(value) <= 0 ? minWidth : true,
              })}
              className={className}
              size={size}
              placeholder="Width"
              disabled={disabled}
            />

            <span className="p-2">x</span>
            <SrcSetInput
              error={errors?.[index]?.['height']?.message?.toString()}
              index={index}
              rest={register(`${name}.${index}.height`, {
                required: heightRequired,
                validate: (value: string) =>
                  Number(value) <= 0 ? minHeight : true,
              })}
              className={className}
              size={size}
              placeholder="Height"
              disabled={disabled}
            />
            <button
              type="button"
              className="khb_btn khb_btn-danger khb_btn-xs"
              onClick={() => remove(index)}
              disabled={disabled}
            >
              <Close />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={() => append({ screenSize: '', width: '', height: '' })}
          className="khb_btn khb_btn-primary khb_btn-xs"
        >
          <Plus className="khb_srcset-remove" />
        </button>
      </div>
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default SrcSet;
