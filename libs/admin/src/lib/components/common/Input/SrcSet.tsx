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
}: {
  size: InputSizes;
  register: any;
  index: number;
  errors: any;
  className?: string;
  name?: string;
  inputKey: string;
  placeholder?: string;
}) => {
  return (
    <div>
      <input
        className={classNames('khb_input', `khb_input-${size}`, className)}
        type={'number'}
        placeholder={placeholder}
        name={`srcset[${index}].${inputKey}`}
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
}: InputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'srcset',
  });
  console.log(errors);
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
            />
            <button
              type="button"
              className="khb_btn khb_btn-danger khb_btn-xs"
              onClick={() => remove(index)}
            >
              <Close />
            </button>
          </div>
        ))}
        <button
          type="button"
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
