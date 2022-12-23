import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropResult } from 'react-beautiful-dnd';

import { SimpleForm } from '../../common/Form';
import ImageUpload from '../../common/ImageUpload';
import DNDItemsList from '../../common/DNDItemsList';
import ItemsAccordian from './ItemsAccordian';

import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import {
  capitalizeFirstLetter,
  changeToCode,
  isEmpty,
} from '../../../helper/utils';
import {
  CombineObjectType,
  FormProps,
  ObjectType,
  OptionType,
  SchemaType,
} from '../../../types';
import Tabs from './Tabs';

const constants = {
  widgetTypeAccessor: 'widgetType',
  itemTypeAccessor: 'itemsType',
  collectionNameAccessor: 'collectionName',
  tabsWidgetTypeValue: 'Tabs',
  fixedCardWidgetTypeValue: 'FixedCard',
  carouselWidgetTypeValue: 'Carousel',
  imageItemsTypeValue: 'Image',
  tabsAccessor: 'tabs',
  tabCollectionItemsAccessor: 'collectionItems',
};

const WidgetForm = ({ formRef }: FormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    setError,
    getValues,
  } = useForm({
    shouldUnregister: false,
  });
  const { baseUrl, switchClass } = useProviderState();
  const {
    t,
    data,
    canAdd,
    canUpdate,
    webItems,
    mobileItems,
    formState,
    itemsTypes,
    widgetTypes,
    onItemFormSubmit,
    onWidgetFormSubmit,
    onDeleteItem,
    onImageRemove,
    onImageUpload,
    getCollectionData,
    collectionData,
    collectionDataLoading,
    formatListItem,
    formatOptionLabel,
  } = useWidgetState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);

  const [webItemsVisible, setWebItemsVisible] = useState(false);
  const [mobileItemsVisible, setMobileItemsVisible] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<
    'FixedCard' | 'Carousel' | 'Tabs'
  >();
  const [itemsEnabled, setItemsEnabled] = useState(true);
  const [selectedCollectionItems, setSelectedCollectionItems] = useState<
    OptionType[]
  >([]);
  const [tabCollectionItems, setTabCollectionItems] = useState<any[]>([]);
  const [selectedCollectionType, setSelectedCollectionType] = useState<
    OptionType | undefined
  >();

  useEffect(() => {
    if (data && formState === 'UPDATE') {
      setSelectedWidgetType(data?.widgetType);
      if (data?.itemsType === 'Image') {
        setItemsEnabled(true);
      } else {
        setItemsEnabled(false);
      }
      if (
        data?.collectionItems &&
        data?.collectionItems.length > 0 &&
        collectionData &&
        collectionData.length > 0
      ) {
        setSelectedCollectionItems(data?.collectionItems || []);
      } else {
        setSelectedCollectionItems([]);
      }
      if (
        data?.collectionName !== 'Image' &&
        itemsTypes &&
        itemsTypes.length > 0
      ) {
        setSelectedCollectionType(
          itemsTypes.find((item) => item.value === data?.collectionName)
        );
      }
    }
  }, [data, formState, collectionData, itemsTypes, setValue]);

  useEffect(() => {
    if (formState === 'ADD') {
      setSelectedCollectionItems([]);
      setItemsEnabled(true);
      setTabCollectionItems([]);
    }
  }, [formState]);

  useEffect(() => {
    if (!isEmpty(data)) {
      reset(data);
    }
  }, [data, reset]);

  const onChangeSearch = (str: string) => {
    if (callerRef.current) clearTimeout(callerRef.current);

    callerRef.current = setTimeout(() => {
      if (selectedCollectionType)
        getCollectionData(selectedCollectionType.value, str);
    }, 300);
  };

  // Form Utility Functions
  function handleCapitalize(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = capitalizeFirstLetter(event.target.value);
    return event;
  }
  function handleCode(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = changeToCode(event.target.value);
    return event;
  }
  const getFirstItemTypeValue = useCallback(
    (widgetType: string) => {
      const derivedItemTypes =
        widgetType === constants.tabsWidgetTypeValue
          ? itemsTypes.filter((item) => item.label !== 'Image')
          : itemsTypes;
      return derivedItemTypes[0];
    },
    [itemsTypes]
  );
  const getFirstWidgetTypeValue = useCallback(() => {
    return widgetTypes[0].value;
  }, [widgetTypes]);

  // Widget Form Functions
  const onWidgetFormInputChange = useCallback(
    (value: ObjectType, name: string | undefined) => {
      if (name === 'widgetType') {
        setSelectedWidgetType(value[name] as any);
        if (value[name] === 'Tabs') {
          const firstItemType = getFirstItemTypeValue(value[name]);
          if (firstItemType) {
            getCollectionData(firstItemType.value);
            setSelectedCollectionType(firstItemType);
          }
        }
      } else if (name === constants.itemTypeAccessor) {
        if (
          value[constants.itemTypeAccessor] === constants.imageItemsTypeValue
        ) {
          setSelectedCollectionType(undefined);
          setItemsEnabled(true);
        } else {
          const selectedWType = itemsTypes.find(
            (wType) => wType.value === value[constants.itemTypeAccessor]
          );
          setSelectedCollectionType(selectedWType);
          getCollectionData(value[constants.itemTypeAccessor]);
          setItemsEnabled(false);
        }
      } else if (name?.includes(constants.tabsAccessor)) {
        setTabCollectionItems(
          (value[constants.tabsAccessor] as unknown as any[]).map(
            (tabItem) => tabItem[constants.tabCollectionItemsAccessor]
          )
        );
      }
    },
    [getCollectionData, getFirstItemTypeValue, itemsTypes]
  );
  const onFormSubmit = (data: CombineObjectType) => {
    const formData = { ...data };
    // setting widget type if undefined
    if (!formData[constants.widgetTypeAccessor] && formState === 'ADD') {
      formData[constants.widgetTypeAccessor] = getFirstWidgetTypeValue();
    }
    // setting tabs data if widgetType tab is selected
    const tabsData = getValues('tabs');
    if (
      Array.isArray(tabsData) &&
      (formData[constants.widgetTypeAccessor] ===
        constants.tabsWidgetTypeValue ||
        formState === 'UPDATE')
    ) {
      formData[constants.tabsAccessor] = tabsData.map((tabItem) => ({
        name: tabItem.name,
        collectionItems: tabItem.collectionItems.map(
          (item: OptionType) => item.value
        ),
      }));
    } else formData[constants.tabsAccessor] = [];
    // setting items type if undefined
    if (!formData[constants.itemTypeAccessor] && formState === 'ADD') {
      formData[constants.itemTypeAccessor] = getFirstItemTypeValue(
        formData[constants.widgetTypeAccessor] as string
      )?.value;
    }
    // setting collectionName if widgetType is FixedCard or Carousel and FormState
    if (
      formData[constants.itemTypeAccessor] !== constants.imageItemsTypeValue &&
      formState === 'ADD'
    ) {
      formData['collectionName'] = selectedCollectionType
        ? selectedCollectionType.value
        : getFirstItemTypeValue(
            formData[constants.widgetTypeAccessor] as string
          )?.value;
    }
    // setting colleciton items if collectionItems are there
    if (
      Array.isArray(selectedCollectionItems) &&
      selectedCollectionItems.length > 0
    ) {
      formData['collectionItems'] = selectedCollectionItems.map(
        (item) => item.value
      );
    }
    onWidgetFormSubmit(formData);
  };
  const onCollectionIndexChange = (result: DropResult) => {
    const { destination, source } = result;
    if (destination) {
      setSelectedCollectionItems((listData) => {
        const temporaryData = [...listData];
        const [selectedRow] = temporaryData.splice(source.index, 1);
        temporaryData.splice(destination.index, 0, selectedRow);
        return temporaryData;
      });
    }
  };
  const onTabItemsIndexChange = (index: number, result: DropResult) => {
    const { destination, source } = result;
    if (destination) {
      const tabCollectionItems = getValues(`tabs.${index}.collectionItems`);
      const temporaryData = [...tabCollectionItems];
      const [selectedRow] = temporaryData.splice(source.index, 1);
      temporaryData.splice(destination.index, 0, selectedRow);
      setValue(`tabs.${index}.collectionItems`, temporaryData);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) =>
      onWidgetFormInputChange(value, name)
    );
    return () => subscription.unsubscribe();
  }, [watch, onWidgetFormInputChange]);

  // Schemas
  const widgetFormSchema: SchemaType[] = [
    {
      label: `${t('widget.name')}`,
      required: true,
      accessor: 'name',
      type: 'text',
      placeholder: t('widget.namePlaceholder'),
      onInput: handleCapitalize,
      validations: {
        required: t('widget.nameRequired'),
      },
      wrapperClassName: 'khb_grid-item-1of2 khb_padding-right-1 khb_align-top',
    },
    {
      label: `${t('widget.code')}`,
      accessor: 'code',
      required: true,
      type: 'text',
      onInput: handleCode,
      editable: false,
      placeholder: t('widget.codePlaceholder'),
      validations: {
        required: t('widget.codeRequired'),
      },
      wrapperClassName:
        'khb_grid-item-1of2 khb_padding-left-1 khb_align-top khb_margin-top-0',
    },
    {
      label: `${t('widget.widgetTitle')}`,
      accessor: 'widgetTitle',
      required: true,
      type: 'text',
      onInput: handleCapitalize,
      placeholder: t('widget.widgetTitlePlaceholder'),
      validations: {
        required: t('widget.widgetTitleRequired'),
      },
      info: t('widget.widgetTitleInfo'),
    },
    {
      label: `${t('widget.widgetType')}`,
      required: true,
      editable: false,
      accessor: 'widgetType',
      type: 'select',
      validations: {
        required: t('widget.widgetTypeRequired'),
      },
      options: widgetTypes,
    },
    {
      label: t('widget.autoPlay'),
      accessor: 'autoPlay',
      type: 'checkbox',
      show: selectedWidgetType === 'Carousel',
      switchClass: switchClass,
    },
    {
      label: `${t('widget.itemsType')}`,
      required: true,
      editable: false,
      accessor: 'itemsType',
      type: 'select',
      validations: {
        required: t('widget.itemsTypePlaceholder'),
      },
      options:
        selectedWidgetType === 'Tabs'
          ? itemsTypes.filter((item) => item.label !== 'Image')
          : itemsTypes,
    },
    {
      label: t('widget.color'),
      accessor: 'backgroundColor',
      type: 'color',
      className: 'khb_input-color',
    },
    {
      label: t('widget.webPerRow'),
      accessor: 'webPerRow',
      type: 'number',
      required: true,
      placeholder: t('widget.webPerRowPlaceholder'),
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-right-1',
      validations: {
        required: t('widget.webPerRowRequired'),
      },
    },
    {
      label: t('widget.tabletPerRow'),
      accessor: 'tabletPerRow',
      type: 'number',
      required: true,
      placeholder: t('widget.tabletPerRowPlaceholder'),
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-left-1',
      validations: {
        required: t('widget.tabletPerRowRequired'),
      },
    },
    {
      label: t('widget.mobilePerRow'),
      accessor: 'mobilePerRow',
      type: 'number',
      required: true,
      placeholder: t('widget.mobilePerRowPlaceholder'),
      wrapperClassName:
        'khb_grid-item-1of3 khb_padding-right-1 khb_padding-left-1',
      validations: {
        required: t('widget.mobilePerRowRequired'),
      },
    },
    {
      label: selectedCollectionType?.label,
      placeholder: `Select ${selectedCollectionType?.label}...`,
      required: true,
      accessor: 'collectionItems',
      type: 'ReactSelect',
      options: collectionData.map((item: ObjectType) => ({
        value: item['_id'] || item['id'],
        label: item['name'],
        ...item,
      })),
      selectedOptions: selectedCollectionItems,
      isMulti: true,
      isSearchable: true,
      onChange: setSelectedCollectionItems,
      onSearch: onChangeSearch,
      isLoading: collectionDataLoading,
      show: !itemsEnabled && selectedWidgetType !== 'Tabs',
      formatOptionLabel: formatOptionLabel,
      listCode: selectedCollectionType?.value,
    },
  ];
  const itemFormSchema: SchemaType[] = [
    {
      label: `${t('item.title')}`,
      required: true,
      accessor: 'title',
      type: 'text',
      placeholder: t('item.titlePlaceholder'),
    },
    {
      label: `${t('item.subtitle')}`,
      accessor: 'subtitle',
      type: 'text',
      placeholder: t('item.subTitlePlaceholder'),
    },
    {
      label: `${t('item.altText')}`,
      accessor: 'altText',
      type: 'text',
      placeholder: t('item.altTextPlaceholder'),
    },
    {
      label: `${t('item.link')}`,
      required: true,
      accessor: 'link',
      type: 'url',
      placeholder: t('item.linkPlaceholder'),
    },
    {
      label: `${t('item.srcset')}`,
      accessor: 'srcset',
      type: 'srcset',
    },
    {
      label: t('item.image'),
      accessor: 'img',
      Input: ({ field, error, setError, disabled }) => (
        <ImageUpload
          imgId={field.value}
          maxSize={10_485_760}
          onError={setError}
          error={error}
          setImgId={(value) => {
            field.onChange(value);
          }}
          baseUrl={baseUrl}
          disabled={disabled}
          text={
            <>
              <div className="khb_img-text-wrapper">
                <label htmlFor="file-upload" className="khb_img-text-label">
                  <span>{t('item.uploadFile')}</span>
                </label>
                <p className="khb_img-text-1">{t('item.dragDrop')}</p>
              </div>
              <p className="khb_img-text-2">{t('item.allowedFormat')}</p>
            </>
          }
          onImageUpload={onImageUpload}
          onImageRemove={onImageRemove}
          className="khb_img-upload-wrapper-3"
        />
      ),
    },
  ];

  if (!canAdd || !canUpdate) return null;
  return (
    <div className="khb_form">
      <SimpleForm
        schema={widgetFormSchema}
        onSubmit={onFormSubmit}
        ref={formRef}
        isUpdating={formState === 'UPDATE'}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        setValue={setValue}
        control={control}
        setError={setError}
      />

      {selectedWidgetType === 'Tabs' ? (
        <Tabs
          control={control}
          register={register}
          deleteTitle={t('widget.tabDeleteTitle')}
          yesButtonText={t('yesButtonText')}
          noButtonText={t('cancelButtonText')}
          options={collectionData.map((item: ObjectType) => ({
            value: item['_id'] || item['id'],
            label: item['name'],
            ...item,
          }))}
          itemsPlaceholder={`Select ${selectedCollectionType?.label}...`}
          onItemsSearch={onChangeSearch}
          isItemsLoading={collectionDataLoading}
          formatOptionLabel={formatOptionLabel}
          listCode={selectedCollectionType?.value || ''}
          onCollectionItemsIndexChange={onTabItemsIndexChange}
          tabCollectionItems={tabCollectionItems}
          formatItem={formatListItem}
        />
      ) : null}

      {!itemsEnabled && selectedWidgetType !== 'Tabs' && (
        <DNDItemsList
          items={selectedCollectionItems}
          onDragEnd={onCollectionIndexChange}
          formatItem={formatListItem}
          listCode={selectedCollectionType?.value}
        />
      )}

      {itemsEnabled && selectedWidgetType !== 'Tabs' && (
        <>
          {/* Web Items */}
          <ItemsAccordian
            collapseId="webItems"
            title={t('widget.webItems')}
            id="webItems"
            schema={itemFormSchema}
            show={webItemsVisible}
            itemsData={webItems}
            toggleShow={setWebItemsVisible}
            onDataSubmit={onItemFormSubmit}
            itemType="Web"
            widgetId={data?._id}
            onDelete={onDeleteItem}
            addText={t('addButtonText')}
            cancelText={t('cancelButtonText')}
            saveText={t('saveButtonText')}
            editText={t('editButtonText')}
            deleteText={t('deleteButtonText')}
          />

          {/* Mobile Items */}
          <ItemsAccordian
            collapseId="mobileItems"
            title={t('widget.mobileItems')}
            id="mobileItems"
            schema={itemFormSchema}
            show={mobileItemsVisible}
            itemsData={mobileItems}
            toggleShow={setMobileItemsVisible}
            onDataSubmit={onItemFormSubmit}
            itemType="Mobile"
            widgetId={data?._id}
            onDelete={onDeleteItem}
            addText={t('addButtonText')}
            cancelText={t('cancelButtonText')}
            saveText={t('saveButtonText')}
            editText={t('editButtonText')}
            deleteText={t('deleteButtonText')}
          />
        </>
      )}
    </div>
  );
};

export default WidgetForm;
