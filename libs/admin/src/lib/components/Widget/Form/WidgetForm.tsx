import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropResult } from 'react-beautiful-dnd';

import { SimpleForm } from '../../common/Form';
import ImageUpload from '../../common/ImageUpload';
import DNDItemsList from '../../common/DNDItemsList';
import TileItemsAccordian from './TileItemsAccordian';

import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import { capitalizeFirstLetter, changeToCode, isEmpty } from '../../../helper/utils';
import {
  CombineObjectType,
  FormProps,
  ObjectType,
  OptionType,
  SchemaType,
} from '../../../types';

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
  } = useForm();
  const { baseUrl, switchClass } = useProviderState();
  const {
    t,
    data,
    canAdd,
    canUpdate,
    webTiles,
    mobileTiles,
    formState,
    widgetTypes,
    selectionTypes,
    onTileFormSubmit,
    onWidgetFormSubmit,
    onDeleteTile,
    onImageRemove,
    onImageUpload,
    getCollectionData,
    collectionData,
    collectionDataLoading,
    formatListItem,
    formatOptionLabel,
  } = useWidgetState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);

  const [webTilesVisible, setWebTilesVisible] = useState(false);
  const [mobileTilesVisible, setMobileTilesVisible] = useState(false);
  const [tilesEnabled, setTilesEnabled] = useState(true);
  const [showAutoPlay, setShowAutoPlay] = useState(false);
  const [selectedCollectionItems, setSelectedCollectionItems] = useState<
    OptionType[]
  >([]);
  const [selectedWidgetType, setSelectedWidgetType] = useState<
    OptionType | undefined
  >();

  useEffect(() => {
    if (data && formState === 'UPDATE') {
      if (data?.selectionType === 'Carousel') {
        setShowAutoPlay(true);
      } else {
        setShowAutoPlay(false);
      }
      if (data?.widgetType === 'Image') {
        setTilesEnabled(true);
      } else {
        setTilesEnabled(false);
      }
      if (
        data?.collectionItems &&
        data?.collectionItems.length > 0 &&
        collectionData &&
        collectionData.length > 0
      ) {
        let item;
        setSelectedCollectionItems(
          data?.collectionItems?.map((itemId: string) => {
            item = collectionData.find(
              (item) => item._id === itemId || item.id === itemId
            );
            return item
              ? {
                  label: item.name,
                  value: item._id || item.id,
                  ...item,
                }
              : {};
          }) || []
        );
      } else {
        setSelectedCollectionItems([]);
      }
      if (
        data?.collectionName !== 'Image' &&
        widgetTypes &&
        widgetTypes.length > 0
      ) {
        setSelectedWidgetType(
          widgetTypes.find((item) => item.value === data?.collectionName)
        );
      }
    }
  }, [data, formState, collectionData, widgetTypes]);

  useEffect(() => {
    if (formState === 'ADD') {
      setSelectedCollectionItems([]);
      setTilesEnabled(true);
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
      if (selectedWidgetType) getCollectionData(selectedWidgetType.value, str);
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

  // Widget Form Functions
  const onWidgetFormInputChange = useCallback(
    (value: ObjectType, name: string | undefined) => {
      if (name === 'selectionType') {
        if (value['selectionType'] === 'Carousel') setShowAutoPlay(true);
        else setShowAutoPlay(false);
      } else if (name === 'widgetType') {
        if (value['widgetType'] === 'Image') {
          setSelectedWidgetType(undefined);
          setTilesEnabled(true);
        } else {
          const selectedWType = widgetTypes.find(
            (wType) => wType.value === value['widgetType']
          );
          setSelectedWidgetType(selectedWType);
          getCollectionData(value['widgetType']);
          setTilesEnabled(false);
        }
      }
    },
    [getCollectionData, widgetTypes]
  );
  const onFormSubmit = (data: CombineObjectType) => {
    const formData = { ...data };
    if (selectedWidgetType && formState === 'ADD') {
      formData['collectionName'] = selectedWidgetType.value;
    }
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
      label: `${t('widget.selectionTitle')}`,
      accessor: 'selectionTitle',
      required: true,
      type: 'text',
      onInput: handleCapitalize,
      placeholder: t('widget.selectionTitlePlaceholder'),
      validations: {
        required: t('widget.selectionTitleRequired'),
      },
    },
    {
      label: `${t('widget.widgetType')}`,
      required: true,
      editable: false,
      accessor: 'widgetType',
      type: 'select',
      validations: {
        required: t('widget.widgetTypePlaceholder'),
      },
      options: widgetTypes,
    },
    {
      label: `${t('widget.selectionType')}`,
      required: true,
      accessor: 'selectionType',
      type: 'select',
      validations: {
        required: t('widget.selectionTypeRequired'),
      },
      options: selectionTypes,
    },
    {
      label: t('widget.autoPlay'),
      accessor: 'autoPlay',
      type: 'checkbox',
      show: showAutoPlay,
      switchClass: switchClass,
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
      label: selectedWidgetType?.label,
      placeholder: `Select ${selectedWidgetType?.label}...`,
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
      show: !tilesEnabled,
      formatOptionLabel: formatOptionLabel,
      listCode: selectedWidgetType?.value,
    },
  ];
  const tileFormSchema: SchemaType[] = [
    {
      label: `${t('tile.title')}`,
      required: true,
      accessor: 'title',
      type: 'text',
      placeholder: t('tile.titlePlaceholder'),
    },
    {
      label: `${t('tile.altText')}`,
      accessor: 'altText',
      type: 'text',
      placeholder: t('tile.altTextPlaceholder'),
    },
    {
      label: `${t('tile.link')}`,
      required: true,
      accessor: 'link',
      type: 'url',
      placeholder: t('tile.linkPlaceholder'),
    },
    {
      label: t('tile.image'),
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
                  <span>{t('tile.uploadFile')}</span>
                </label>
                <p className="khb_img-text-1">{t('tile.dragDrop')}</p>
              </div>
              <p className="khb_img-text-2">{t('tile.allowedFormat')}</p>
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
      {!tilesEnabled && (
        <DNDItemsList
          items={selectedCollectionItems}
          onDragEnd={onCollectionIndexChange}
          formatItem={formatListItem}
          listCode={selectedWidgetType?.value}
        />
      )}

      {tilesEnabled && (
        <>
          {/* Web Items */}
          <TileItemsAccordian
            collapseId="webItems"
            title={t('widget.webTiles')}
            id="webTiles"
            schema={tileFormSchema}
            show={webTilesVisible}
            tilesData={webTiles}
            toggleShow={setWebTilesVisible}
            onDataSubmit={onTileFormSubmit}
            tileType="Web"
            widgetId={data?._id}
            onDelete={onDeleteTile}
            addText={t('addButtonText')}
            cancelText={t('cancelButtonText')}
            saveText={t('saveButtonText')}
            editText={t('editButtonText')}
            deleteText={t('deleteButtonText')}
          />

          {/* Mobile Items */}
          <TileItemsAccordian
            collapseId="mobileItems"
            title={t('widget.mobileTiles')}
            id="mobileTiles"
            schema={tileFormSchema}
            show={mobileTilesVisible}
            tilesData={mobileTiles}
            toggleShow={setMobileTilesVisible}
            onDataSubmit={onTileFormSubmit}
            tileType="Mobile"
            widgetId={data?._id}
            onDelete={onDeleteTile}
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
};;

export default WidgetForm;
