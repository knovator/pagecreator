import React, { useEffect, useState } from 'react';
import Accordian from '../../common/Accordian';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { ItemsAccordianProps } from '../../../types';
import { Controller, useFieldArray } from 'react-hook-form';
import ImageUpload from '../../common/ImageUpload';
import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import ConfirmPopover from '../../common/ConfirmPopover';

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
  const { baseUrl } = useProviderState();
  const { onImageUpload, onImageRemove, t, imageBaseUrl, imageMaxSize } =
    useWidgetState();
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
                title={t('item.deleteTitle')}
                confirmText={t('yesButtonText') || t('common:yesButtonText')}
                cancelText={
                  t('cancelButtonText') || t('common:cancelButtonText')
                }
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
                      rest={register(`${name}.${index}.titles.${lang.code}`, {
                        required: t('item.titleRequired'),
                      })}
                      label={t('item.title') + ` (${lang.name})`}
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
                        t('item.titlePlaceholder') + ` (${lang.name})`
                      }
                      required
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.title`, {
                    required: t('item.titleRequired'),
                  })}
                  label={t('item.title')}
                  error={errors[name]?.[index]?.['title']?.message?.toString()}
                  type="text"
                  className="w-full p-2"
                  placeholder={t('item.titlePlaceholder')}
                  required
                />
              )}
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <Input
                      rest={register(`${name}.${index}.subtitles.${lang.code}`)}
                      label={t('item.subtitle') + ` (${lang.name})`}
                      type="text"
                      className="w-full p-2"
                      placeholder={
                        t('item.subTitlePlaceholder') + ` (${lang.name})`
                      }
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.subtitle`)}
                  label={t('item.subtitle')}
                  type="text"
                  className="w-full p-2"
                  placeholder={t('item.subTitlePlaceholder')}
                />
              )}
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <Input
                      rest={register(`${name}.${index}.altTexts.${lang.code}`)}
                      label={t('item.altText') + ` (${lang.name})`}
                      type={'text'}
                      className="w-full p-2"
                      placeholder={
                        t('item.altTextPlaceholder') + ` (${lang.name})`
                      }
                    />
                  ))}
                </>
              ) : (
                <Input
                  rest={register(`${name}.${index}.altText`)}
                  label={t('item.altText')}
                  type={'text'}
                  className="w-full p-2"
                  placeholder={t('item.altTextPlaceholder')}
                />
              )}
              <Input
                rest={register(`${name}.${index}.link`)}
                label={t('item.link')}
                type={'url'}
                className="w-full p-2"
                placeholder={t('item.linkPlaceholder')}
              />
              <Input.SrcSet
                control={control}
                register={register}
                label={t(`item.srcset`)}
                name={`${name}.${index}.srcset`}
                errors={errors[name]?.[index]?.['srcset']}
                t={t}
              />
              {Array.isArray(languages) && languages.length > 0 ? (
                <>
                  {languages.map((lang) => (
                    <ImageInput
                      key={lang.code}
                      label={t('item.image') + ` (${lang.name})`}
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
                              <span>{t('item.uploadFile')}</span>
                            </div>
                            <p className="khb_img-text-1">
                              {t('item.dragDrop')}
                            </p>
                          </div>
                          <p className="khb_img-text-2">
                            {t('item.allowedFormat')}
                          </p>
                        </>
                      }
                    />
                  ))}
                </>
              ) : (
                <ImageInput
                  label={t('item.image')}
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
                          <span>{t('item.uploadFile')}</span>
                        </div>
                        <p className="khb_img-text-1">{t('item.dragDrop')}</p>
                      </div>
                      <p className="khb_img-text-2">
                        {t('item.allowedFormat')}
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
