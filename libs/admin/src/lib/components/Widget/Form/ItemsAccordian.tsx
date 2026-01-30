import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

import Input from '../../common/Input';
import Button from '../../common/Button';
import Accordian from '../../common/Accordian';
import ImageUpload from '../../common/ImageUpload';
import { ItemsAccordianProps } from '../../../types';
import ConfirmPopover from '../../common/ConfirmPopover';
import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';

interface ImageInputProps {
  label: string;
  control: any;
  name: string;
  error: any;
  baseUrl: string;
  imageMaxSize: number;
  onImageUpload: (file: File) => Promise<void | {
    fileUrl: string;
    fileId: string;
    fileUri: string;
  }>;
  text: string | JSX.Element;
  onImageRemove: (fileId: string) => Promise<void>;
  setError: (name: string, error: any) => void;
  clearError: (name: string) => void;
}

const ImageInput = ({
  label,
  control,
  name,
  text,
  error,
  baseUrl,
  setError,
  clearError,
  onImageRemove,
  imageMaxSize,
  onImageUpload,
}: ImageInputProps) => {
  return (
    <div className="kms_input-wrapper">
      <label className="kms_input-label">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ImageUpload
            imgId={field.value}
            clearError={() => clearError(name)}
            maxSize={imageMaxSize}
            onError={(msg) =>
              setError(name, {
                type: 'custom',
                message: msg,
              })
            }
            error={error}
            setImgId={(value) => {
              field.onChange(value);
            }}
            baseUrl={baseUrl}
            text={text}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            className="khb_img-upload-wrapper-3"
          />
        )}
      />
    </div>
  );
};

const ItemsAccordian = ({
  show,
  title,
  id,
  collapseId,
  toggleShow,
  loading,
  name,
  errors,
  control,
  register,
  setError,
  itemType,
  languages,
  clearError,
  addText = 'Add',
  deleteText = 'Delete',
}: ItemsAccordianProps) => {
  const { baseUrl, commonTranslations } = useProviderState();
  const {
    onImageUpload,
    onImageRemove,
    imageBaseUrl,
    imageMaxSize,
    widgetTranslations,
  } = useWidgetState();
  const [itemsShow, setItemsShow] = useState<boolean[]>([]);
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({ name, control });

  const onItemsToggleClick = (index: number, status?: boolean) => {
    const newItemsShow: boolean[] = [...itemsShow];
    const newStatus = errors?.[name]?.[index]
      ? true
      : typeof status === 'undefined'
      ? !newItemsShow[index]
      : status;
    newItemsShow[index] = newStatus;
    setItemsShow(newItemsShow);
  };

  useEffect(() => {
    if (errors && errors?.[name]?.length > 0) {
      errors?.[name]?.forEach((errorItem: any, index: number) => {
        if (errorItem) onItemsToggleClick(index, true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, name, errors?.[name]]);

  const addTab = (index: number) => {
    appendItem({
      altText: '',
      link: '',
      img: '',
      srcset: [],
      itemType,
      sequence: index,
    });
  };

  return (
    <Accordian
      open={show}
      onToggle={() => toggleShow(!show)}
      title={title}
      collapseId={collapseId}
      id={id}
      footerContent={
        <Button
          size="sm"
          disabled={loading}
          onClick={() => addTab(items.length)}
        >
          {addText}
        </Button>
      }
    >
      <div className="khb_item-items">
        {items?.map((field, index) => (
          <Accordian
            key={index}
            open={itemsShow[index]}
            onToggle={() => onItemsToggleClick(index)}
            title={`Item ${index + 1}`}
            collapseId={`${id}-item-content-${index}`}
            id={`${id}-item-${index}`}
            footerContent={
              <ConfirmPopover
                onConfirm={() => removeItem(index)}
                title={widgetTranslations.deleteTitle}
                confirmText={commonTranslations.yes}
                cancelText={commonTranslations.cancel}
              >
                <Button type="danger" size="sm" disabled={loading}>
                  {deleteText}
                </Button>
              </ConfirmPopover>
            }
          >
            <div className="khb-form-items">
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <Input
                      rest={register(`${name}.${index}.titles.${lang.code}`)}
                      label={commonTranslations.title + ` (${lang.name})`}
                      error={
                        errors[name]?.[index]?.['titles']?.[lang.code]
                          ? errors[name]?.[index]?.['titles']?.[
                              lang.code
                            ]?.message?.toString() + ` (${lang.name})`
                          : ''
                      }
                      type="text"
                      className="w-full p-2"
                      placeholder={
                        commonTranslations.titlePlaceholder + ` (${lang.name})`
                      }
                     
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.title`)}
                  label={commonTranslations.title}
                  error={errors[name]?.[index]?.['title']?.message?.toString()}
                  type="text"
                  className="w-full p-2"
                  placeholder={commonTranslations.titlePlaceholder}
                
                />
              )}
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <Input
                      rest={register(`${name}.${index}.subtitles.${lang.code}`)}
                      label={widgetTranslations.subtitle + ` (${lang.name})`}
                      type="text"
                      className="w-full p-2"
                      placeholder={
                        widgetTranslations.subTitlePlaceholder +
                        ` (${lang.name})`
                      }
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.subtitle`)}
                  label={widgetTranslations.subtitle}
                  type="text"
                  className="w-full p-2"
                  placeholder={widgetTranslations.subTitlePlaceholder}
                />
              )}
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <Input
                      rest={register(`${name}.${index}.altTexts.${lang.code}`)}
                      label={widgetTranslations.altText + ` (${lang.name})`}
                      type="text"
                      className="w-full p-2"
                      placeholder={
                        widgetTranslations.altTextPlaceholder +
                        ` (${lang.name})`
                      }
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.altText`)}
                  label={widgetTranslations.altText}
                  type="text"
                  className="w-full p-2"
                  placeholder={widgetTranslations.altTextPlaceholder}
                />
              )}
              <Input
                rest={register(`${name}.${index}.link`)}
                label={widgetTranslations.link}
                type="url"
                className="w-full p-2"
                placeholder={widgetTranslations.linkPlaceholder}
              />
              <Input.SrcSet
                control={control}
                register={register}
                label={widgetTranslations.srcset}
                name={`${name}.${index}.srcset`}
                errors={errors[name]?.[index]?.['srcset']}
                screenSizeRequired={widgetTranslations.screenSizeRequired}
                heightRequired={widgetTranslations.heightRequired}
                minHeight={widgetTranslations.minHeight}
                minScreenSize={widgetTranslations.minScreenSize}
                minWidth={widgetTranslations.minWidth}
                widthRequired={widgetTranslations.widthRequired}
              />
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <ImageInput
                      key={lang.code}
                      label={widgetTranslations.image + ` (${lang.name})`}
                      control={control}
                      name={`${name}.${index}.imgs.${lang.code}`}
                      error={errors[name]?.[index]?.['imgs']?.[
                        lang.code
                      ]?.message?.toString()}
                      baseUrl={imageBaseUrl ? imageBaseUrl : baseUrl}
                      setError={setError}
                      clearError={clearError}
                      onImageRemove={onImageRemove}
                      imageMaxSize={imageMaxSize}
                      onImageUpload={onImageUpload}
                      text={
                        <>
                          <div className="khb_img-text-wrapper">
                            <div className="khb_img-text-label">
                              <span>{widgetTranslations.uploadFile}</span>
                            </div>
                            <p className="khb_img-text-1">
                              {widgetTranslations.dragDrop}
                            </p>
                          </div>
                          <p className="khb_img-text-2">
                            {widgetTranslations.allowedFormat}
                          </p>
                        </>
                      }
                    />
                  ))}
                </>
              ) : (
                <ImageInput
                  label={widgetTranslations.image}
                  control={control}
                  name={`${name}.${index}.img`}
                  error={errors[name]?.[index]?.['img']?.message?.toString()}
                  baseUrl={imageBaseUrl ? imageBaseUrl : baseUrl}
                  setError={setError}
                  clearError={clearError}
                  onImageRemove={onImageRemove}
                  imageMaxSize={imageMaxSize}
                  onImageUpload={onImageUpload}
                  text={
                    <>
                      <div className="khb_img-text-wrapper">
                        <div className="khb_img-text-label">
                          <span>{widgetTranslations.uploadFile}</span>
                        </div>
                        <p className="khb_img-text-1">
                          {widgetTranslations.dragDrop}
                        </p>
                      </div>
                      <p className="khb_img-text-2">
                        {widgetTranslations.allowedFormat}
                      </p>
                    </>
                  }
                />
              )}
            </div>
          </Accordian>
        ))}
      </div>
    </Accordian>
  );
};

export default ItemsAccordian;
