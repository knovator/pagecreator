import React from 'react';
import classNames from 'classnames';
import { useFieldArray } from 'react-hook-form';
import Close from '../../../icons/close';
import Plus from '../../../icons/plus';
import { InputProps, InputSizes, ObjectType } from '../../../types';

const SrcSetInput = ({
  size,
  className,
  index,
  register,
  errors,
  name,
  inputKey,
  placeholder,
  disabled = false,
}: {
  size: InputSizes;
  register: any;
  index: number;
  errors: any;
  className?: string;
  name?: string;
  inputKey: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  return (
    <div>
      <input
        className={classNames('khb_input', `khb_input-${size}`, className)}
        type={'number'}
        placeholder={placeholder}
        name={`srcset[${index}].${inputKey}`}
        disabled={disabled}
        {...register(`srcset[${index}].${inputKey}`, {
          required: `${name} Size is required`,
          validate: (value: string) =>
            Number(value) <= 0 ? `${inputKey} should be greater than 0` : true,
        })}
      />
      {Array.isArray(errors) && errors[index] && (
        <p className="khb_input-error">
          {(errors[index]?.[inputKey] as ObjectType)?.['message']}
        </p>
      )}
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
  disabled = false,
}: InputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'srcset',
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
              errors={errors}
              index={index}
              className={className}
              inputKey="screenSize"
              name="Screen Size"
              size={size}
              placeholder="Screen Size"
              register={register}
              disabled={disabled}
            />

            <span className="p-2">=</span>
            <SrcSetInput
              errors={errors}
              index={index}
              register={register}
              className={className}
              inputKey="width"
              name="Width"
              size={size}
              placeholder="Width"
              disabled={disabled}
            />

            <span className="p-2">x</span>
            <SrcSetInput
              errors={errors}
              index={index}
              register={register}
              className={className}
              inputKey="height"
              name="Height"
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
          <Plus className="w-7 h-7" />
        </button>
      </div>
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default SrcSet;
