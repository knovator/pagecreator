import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropResult } from 'react-beautiful-dnd';

import { SimpleForm } from '../../common/Form';
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
  collectionItemsAccessor: 'collectionItems',
  tabsWidgetTypeValue: 'Tabs',
  fixedCardWidgetTypeValue: 'FixedCard',
  carouselWidgetTypeValue: 'Carousel',
  imageItemsTypeValue: 'Image',
  tabsAccessor: 'tabs',
  webItems: 'webItems',
  mobileItems: 'mobileItems',
  tabCollectionItemsAccessor: 'collectionItems',
};

const WidgetForm = ({ formRef, customInputs }: FormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    clearErrors,
    setError,
    getValues,
  } = useForm({
    shouldUnregister: false,
  });
  const { switchClass } = useProviderState();
  const {
    t,
    data,
    canAdd,
    canUpdate,
    formState,
    itemsTypes,
    widgetTypes,
    loading,
    onWidgetFormSubmit,
    getCollectionData,
    collectionData,
    collectionDataLoading,
    formatListItem,
    formatOptionLabel,
    reactSelectStyles,
  } = useWidgetState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeTab, setActiveTab] = useState(0);
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
  const [collectionItemsUpdated, setCollectionItemsUpdated] = useState(false);
  const [tabCollectionItemsUpdated, setTabCollectionItemsUpdated] = useState<
    boolean[]
  >([]);

  useEffect(() => {
    if (data && formState === 'UPDATE') {
      setSelectedWidgetType(data?.widgetType);
      if (data?.itemsType === 'Image') {
        setItemsEnabled(true);
      } else {
        setItemsEnabled(false);
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
  }, [data, formState, itemsTypes]);

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

  const onChangeSearch = (
    str?: string,
    callback?: (options: OptionType[]) => void
  ): any => {
    let collectionItems: any[] = [];
    let valueToSet = '';
    if (formState === 'UPDATE') {
      if (
        data[constants.widgetTypeAccessor] === constants.tabsWidgetTypeValue
      ) {
        collectionItems = data[constants.tabsAccessor][activeTab]
          ? data[constants.tabsAccessor][activeTab]['collectionItems']
          : [];
        valueToSet = `${constants.tabsAccessor}.${activeTab}.${constants.tabCollectionItemsAccessor}`;
      } else if (
        Array.isArray(data[constants.collectionItemsAccessor]) &&
        data[constants.collectionItemsAccessor].length > 0
      ) {
        if (collectionItemsUpdated)
          collectionItems = selectedCollectionItems.map(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (collectionItem) => collectionItem._id
          );
        else collectionItems = data[constants.collectionItemsAccessor];
        // valueToSet = constants.collectionItemsAccessor;
      }
    }
    if (callerRef.current) clearTimeout(callerRef.current);
    let item: any;

    callerRef.current = setTimeout(() => {
      if (selectedCollectionType)
        getCollectionData(
          selectedCollectionType.value,
          str,
          (options) => {
            if (typeof callback === 'function')
              callback(
                options.map((item: ObjectType) => ({
                  value: item['_id'] || item['id'],
                  label: item['name'],
                  ...item,
                }))
              );
            if (formState === 'UPDATE') {
              let selectedOptions =
                collectionItems?.map((itemId: string) => {
                  item = (options as any[]).find(
                    (item) => item._id === itemId || item.id === itemId
                  );
                  return item
                    ? {
                        label: item.name,
                        value: item._id || item.id,
                        ...item,
                      }
                    : {};
                }) || [];
              selectedOptions = selectedOptions.filter((obj) => !!obj.value);
              if (valueToSet) {
                // only set tabcollection items, when they are not set
                if (!tabCollectionItemsUpdated[activeTab]) {
                  const updatedArr = tabCollectionItemsUpdated;
                  updatedArr[activeTab] = true;
                  setTabCollectionItemsUpdated(updatedArr);
                  setValue(valueToSet, selectedOptions);
                }
              } else {
                setSelectedCollectionItems(selectedOptions);
                setCollectionItemsUpdated(true);
              }
            }
          },
          collectionItems
        );
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
          setItemsEnabled(false);
        }
      } else if (
        name?.includes(constants.tabsAccessor) &&
        Array.isArray(value[constants.tabsAccessor])
      ) {
        setTabCollectionItems(
          (value[constants.tabsAccessor] as unknown as any[]).map(
            (tabItem) => tabItem[constants.tabCollectionItemsAccessor]
          )
        );
      }
    },
    [getFirstItemTypeValue, itemsTypes]
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
          (item: string | OptionType) =>
            typeof item == 'string' ? item : item.value
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
    let items = [
      ...(getValues(constants.webItems) || []),
      ...(getValues(constants.mobileItems) || []),
    ];
    items = items.map(({ _id, __v, widgetId, ...item }) => {
      if (item['img'] && item['img']['_id']) {
        item['img'] = item['img']['_id'];
      } else if (typeof item['img'] !== 'string' || !item['img']) {
        delete item['img'];
      }
      return item;
    });
    onWidgetFormSubmit({
      ...formData,
      items,
    });
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
      type: customInputs && customInputs['widgetTitle'] ? undefined : 'text',
      onInput: handleCapitalize,
      placeholder: t('widget.widgetTitlePlaceholder'),
      validations: {
        required: t('widget.widgetTitleRequired'),
      },
      info: t('widget.widgetTitleInfo'),
      Input:
        customInputs && customInputs['widgetTitle']
          ? customInputs['widgetTitle']
          : undefined,
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
        min: {
          value: 1,
          message: t('widget.minPerRow'),
        },
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
        min: {
          value: 1,
          message: t('widget.minPerRow'),
        },
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
        min: {
          value: 1,
          message: t('widget.minPerRow'),
        },
      },
    },
    {
      label: selectedCollectionType?.label,
      placeholder: `Select ${selectedCollectionType?.label}...`,
      required: true,
      accessor: 'collectionItems',
      type: 'ReactSelect',
      options: collectionData,
      selectedOptions: selectedCollectionItems,
      isMulti: true,
      isSearchable: true,
      onChange: setSelectedCollectionItems,
      loadOptions: onChangeSearch,
      isLoading: collectionDataLoading,
      show: !itemsEnabled && selectedWidgetType !== 'Tabs',
      formatOptionLabel: formatOptionLabel,
      listCode: selectedCollectionType?.value,
      customStyles: reactSelectStyles || {},
      selectKey: selectedCollectionType?.value,
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
          itemsPlaceholder={`Select ${selectedCollectionType?.label}...`}
          loadOptions={onChangeSearch}
          isItemsLoading={collectionDataLoading}
          formatOptionLabel={formatOptionLabel}
          listCode={selectedCollectionType?.value || ''}
          onCollectionItemsIndexChange={onTabItemsIndexChange}
          tabCollectionItems={tabCollectionItems}
          formatItem={formatListItem}
          customStyles={reactSelectStyles || {}}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
            clearError={clearErrors}
            collapseId={constants.webItems}
            title={t('widget.webItems')}
            id={constants.webItems}
            setError={setError}
            show={webItemsVisible || !!(errors && errors?.[constants.webItems])}
            toggleShow={setWebItemsVisible}
            itemType="Web"
            name={constants.webItems}
            errors={errors}
            control={control}
            register={register}
            loading={loading}
            addText={t('addButtonText')}
            deleteText={t('deleteButtonText')}
          />

          {/* Mobile Items */}
          <ItemsAccordian
            clearError={clearErrors}
            collapseId={constants.mobileItems}
            title={t('widget.mobileItems')}
            id={constants.mobileItems}
            name={constants.mobileItems}
            setError={setError}
            loading={loading}
            show={
              mobileItemsVisible ||
              !!(errors && errors?.[constants.mobileItems])
            }
            toggleShow={setMobileItemsVisible}
            itemType="Mobile"
            errors={errors}
            control={control}
            register={register}
            addText={t('addButtonText')}
            deleteText={t('deleteButtonText')}
          />
        </>
      )}
    </div>
  );
};

export default WidgetForm;
