import React, { forwardRef, MutableRefObject } from 'react';
import { Controller } from 'react-hook-form';
import {
  CombineObjectType,
  OptionType,
  SchemaType,
} from '../../../types';

import Input from '../Input';
import CustomReactSelect from '../Input/ReactSelect';

interface SimpleFormProps {
  schema: SchemaType[];
  isUpdating?: boolean;
  onSubmit: (data: CombineObjectType) => void;
  enable?: boolean;
  ref: MutableRefObject<HTMLFormElement | null>;
  register: any;
  errors: any;
  handleSubmit: any;
  setValue: any;
  control: any;
  setError: any;
}

const SimpleForm = forwardRef<HTMLFormElement | null, SimpleFormProps>(
  (
    {
      schema,
      onSubmit,
      isUpdating = false,
      enable = true,
      register,
      errors,
      handleSubmit,
      setValue,
      control,
      setError,
    },
    ref
  ) => {
    const inputRenderer = (schema: SchemaType) => {
      let input;
      if (typeof schema.show !== 'undefined' && !schema.show) return null;
      if (schema.type) {
        switch (schema.type) {
          case 'ReactSelect':
            input = (
              <CustomReactSelect
                options={schema.options}
                disabled={!enable}
                label={schema.label}
                error={errors[schema.accessor]?.message?.toString()}
                onChange={(value: OptionType | OptionType[] | null) => {
                  if (value) {
                    setValue(
                      schema.accessor,
                      Array.isArray(value)
                        ? value.map((item) => item.value)
                        : value.value
                    );
                    if (schema.onChange) schema.onChange(value);
                  }
                }}
                selectedOptions={schema.selectedOptions}
                required={schema.required}
                isMulti={schema.isMulti}
                isSearchable={schema.isSearchable}
                onSearch={schema.onSearch}
                isLoading={schema.isLoading}
                placeholder={schema.placeholder}
                wrapperClassName={schema.wrapperClassName}
                formatOptionLabel={schema.formatOptionLabel}
                listCode={schema.listCode}
              />
            );
            break;
          case 'checkbox':
            input = (
              <Input.Checkbox
                error={errors[schema.accessor]?.message?.toString()}
                switchClass={schema.switchClass}
                label={schema.label}
                rest={register(schema.accessor, schema.validations || {})}
                className="block"
                disabled={
                  isUpdating &&
                  typeof schema.editable !== 'undefined' &&
                  !schema.editable
                }
                wrapperClassName={schema.wrapperClassName}
              />
            );
            break;
          case 'select':
            input = (
              <Controller
                control={control}
                name={schema.accessor}
                render={({ field }) => (
                  <Input.Select
                    options={schema.options}
                    label={schema.label}
                    error={errors[schema.accessor]?.message?.toString()}
                    // onChange={(e) => field.onChange(e.target.value)}
                    rest={field}
                    // value={field.value}
                    className="w-full"
                    disabled={
                      (isUpdating &&
                        typeof schema.editable !== 'undefined' &&
                        !schema.editable) ||
                      !enable
                    }
                    required={schema.required}
                    wrapperClassName={schema.wrapperClassName}
                  />
                )}
              ></Controller>
            );
            break;
          case 'text':
          case 'number':
          case 'url':
          default:
            input = (
              <Input
                rest={register(schema.accessor, schema.validations || {})}
                label={schema.label}
                error={errors[schema.accessor]?.message?.toString()}
                type={schema.type}
                className="w-full p-2"
                placeholder={schema.placeholder}
                disabled={
                  (isUpdating &&
                    typeof schema.editable !== 'undefined' &&
                    !schema.editable) ||
                  !enable
                }
                required={schema.required}
                onInput={schema.onInput}
                wrapperClassName={schema.wrapperClassName}
              />
            );
            break;
        }
      } else if (schema.Input) {
        input = (
          <div className="kms_input-wrapper">
            <label className="kms_input-label">{schema.label}</label>
            <Controller
              control={control}
              name={schema.accessor}
              rules={schema.validations}
              render={({ field }) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                schema.Input!({
                  field,
                  error: errors[schema.accessor]?.message?.toString(),
                  disabled:
                    (isUpdating &&
                      typeof schema.editable !== 'undefined' &&
                      !schema.editable) ||
                    !enable,
                  setError: (msg) =>
                    setError.call(null, schema.accessor, {
                      type: 'custom',
                      message: msg,
                    }),
                })
              }
            />
          </div>
        );
      } else
        throw new Error(
          `Please provide Input or type prop to render input Labeled ${schema.label}`
        );

      return input;
    };

    const onFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit((data: any) => {
        const formattedData: CombineObjectType = schema.reduce(
          (values: CombineObjectType, schemaItem: SchemaType) => {
            // Do not add field if editing is disabled for it
            if (
              isUpdating &&
              typeof schemaItem.editable !== 'undefined' &&
              !schemaItem.editable
            )
              return values;

            if (schemaItem.type === 'number') {
              values[schemaItem.accessor] =
                data[schemaItem.accessor] === ''
                  ? null
                  : parseInt(data[schemaItem.accessor]);
            } else values[schemaItem.accessor] = data[schemaItem.accessor];
            return values;
          },
          {}
        );
        onSubmit(formattedData);
      })();
    };

    return (
      <form onSubmit={onFormSubmit} ref={ref} className="khb-form-items">
        {schema.map((schema, i) => (
          <React.Fragment key={i}>{inputRenderer(schema)}</React.Fragment>
        ))}
      </form>
    );
  }
);

export default SimpleForm;
