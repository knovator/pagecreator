import React, { useCallback, useEffect, useState } from 'react';
import Accordian from '../../common/Accordian';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { ItemsAccordianProps } from '../../../types';
import { Controller, useFieldArray } from 'react-hook-form';
import ImageUpload from '../../common/ImageUpload';
import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import ConfirmPopover from '../../common/ConfirmPopover';

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
  addText = 'Add',
  deleteText = 'Delete',
}: ItemsAccordianProps) => {
  const { baseUrl } = useProviderState();
  const { onImageUpload, onImageRemove, t, imageBaseUrl } = useWidgetState();
  const [itemsShow, setItemsShow] = useState<boolean[]>([]);
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({ name, control });

  const onItemsToggleClick = useCallback(
    (index: number, status?: boolean) => {
      const newItemsShow: boolean[] = [...itemsShow];
      const newStatus = errors?.[name]?.[index]
        ? true
        : typeof status === 'undefined'
        ? !newItemsShow[index]
        : status;
      newItemsShow[index] = newStatus;
      setItemsShow(newItemsShow);
    },
    [errors, itemsShow, name]
  );

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
      title: '',
      subtitle: '',
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
                confirmText={t('yesButtonText')}
                cancelText={t('cancelButtonText')}
              >
                <Button type="danger" size="sm" disabled={loading}>
                  {deleteText}
                </Button>
              </ConfirmPopover>
            }
          >
            <div className="khb-form-items">
              <Input
                rest={register(`${name}.${index}.title`, {
                  required: t('item.titleRequired'),
                })}
                label={t('item.title')}
                error={errors[name]?.[index]?.['title']?.message?.toString()}
                type={'text'}
                className="w-full p-2"
                placeholder={t('item.titlePlaceholder')}
                required
              />
              <Input
                rest={register(`${name}.${index}.subtitle`)}
                label={t('item.subtitle')}
                type={'text'}
                className="w-full p-2"
                placeholder={t('item.subTitlePlaceholder')}
              />
              <Input
                rest={register(`${name}.${index}.altText`)}
                label={t('item.altText')}
                type={'text'}
                className="w-full p-2"
                placeholder={t('item.altTextPlaceholder')}
              />
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
              <div className="kms_input-wrapper">
                <label className="kms_input-label">{t('item.image')}</label>
                <Controller
                  control={control}
                  name={`${name}.${index}.img`}
                  render={({ field }) => (
                    <ImageUpload
                      imgId={field.value}
                      maxSize={10_485_760}
                      onError={(msg) =>
                        setError(`${name}.${index}.img`, {
                          type: 'custom',
                          message: msg,
                        })
                      }
                      error={errors[name]?.[index]?.[
                        'img'
                      ]?.message?.toString()}
                      setImgId={(value) => {
                        field.onChange(value);
                      }}
                      baseUrl={imageBaseUrl ? imageBaseUrl : baseUrl}
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
                      onImageUpload={onImageUpload}
                      onImageRemove={onImageRemove}
                      className="khb_img-upload-wrapper-3"
                    />
                  )}
                />
              </div>
            </div>
          </Accordian>
        ))}
      </div>
    </Accordian>
  );
};

export default ItemsAccordian;
