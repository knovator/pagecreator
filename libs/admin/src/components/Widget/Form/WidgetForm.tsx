import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';

import Form from '../../common/Form';
import Drawer from '../../common/Drawer';
import Button from '../../common/Button';
import ImageUpload from '../../common/ImageUpload';
import DNDItemsList from '../../common/DNDItemsList';
import TileItemsAccordian from './TileItemsAccordian';

import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import { capitalizeFirstLetter, changeToCode } from '../../../helper/utils';
import {
  CombineObjectType,
  FormProps,
  ObjectType,
  OptionType,
  SchemaType,
} from 'libs/admin/src/types';

const WidgetForm = ({ onClose, open, formState }: FormProps) => {
  const { baseUrl } = useProviderState();
  const {
    t,
    data,
    canAdd,
    canUpdate,
    tilesList,
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
  const widgetFormRef = useRef<HTMLFormElement | null>(null);

  const [webShow, setWebShow] = useState(false);
  const [mobileShow, setMobileShow] = useState(false);
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
            item = collectionData.find((item) => item._id === itemId);
            return item
              ? {
                  label: item.name,
                  value: item._id,
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
  const onWidgetFormSubmitClick = () => {
    widgetFormRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };
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
    },
    {
      label: t('widget.webPerRow'),
      accessor: 'webPerRow',
      type: 'number',
      placeholder: t('widget.webPerRowPlaceholder'),
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-right-1',
    },
    {
      label: t('widget.mobilePerRow'),
      accessor: 'mobilePerRow',
      type: 'number',
      placeholder: t('widget.mobilePerRowPlaceholder'),
      wrapperClassName:
        'khb_grid-item-1of3 khb_padding-right-1 khb_padding-left-1',
    },
    {
      label: t('widget.tabletPerRow'),
      accessor: 'tabletPerRow',
      type: 'number',
      placeholder: t('widget.tabletPerRowPlaceholder'),
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-left-1',
    },
    {
      label: selectedWidgetType?.label,
      placeholder: `Select ${selectedWidgetType?.label}...`,
      required: true,
      accessor: 'collectionItems',
      type: 'ReactSelect',
      options: collectionData.map((item: ObjectType) => ({
        value: item['_id'],
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
    <Drawer
      open={open}
      onClose={onClose}
      title={
        formState === 'ADD'
          ? t('widget.addWidgetTitle')
          : formState === 'UPDATE'
          ? t('widget.updateWidgetTitle')
          : ''
      }
      footerContent={
        <>
          <Button type="secondary" onClick={onClose}>
            {t('cancelButtonText')}
          </Button>
          <Button onClick={onWidgetFormSubmitClick}>
            {t('saveButtonText')}
          </Button>
        </>
      }
    >
      <div className="khb_form">
        <Form
          schema={widgetFormSchema}
          onSubmit={onFormSubmit}
          ref={widgetFormRef}
          data={data}
          isUpdating={formState === 'UPDATE'}
          watcher={onWidgetFormInputChange}
        />
        {!tilesEnabled && (
          <DNDItemsList
            items={selectedCollectionItems}
            onDragEnd={onCollectionIndexChange}
            formatItem={formatListItem}
          />
        )}

        {tilesEnabled && (
          <>
            {/* Web Items */}
            <TileItemsAccordian
              collapseId="webItems"
              title={t('widget.webItems')}
              id="web"
              schema={tileFormSchema}
              show={webShow}
              tilesData={tilesList['web']}
              toggleShow={setWebShow}
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
              title={t('widget.mobileItems')}
              id="mobile"
              schema={tileFormSchema}
              show={mobileShow}
              tilesData={tilesList['mobile']}
              toggleShow={setMobileShow}
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
    </Drawer>
  );
};

export default WidgetForm;
