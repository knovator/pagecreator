import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropResult } from 'react-beautiful-dnd';

import { SimpleForm } from '../../common/Form';
import DNDItemsList from '../../common/DNDItemsList';
import ItemsAccordian from './ItemsAccordian';

import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';
import request from '../../../api';
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
  textWidgetTypeValue: 'Text',
  htmlWidgetTypeValue: 'HTML',
  linksWidgetTypeValue: 'Links',
  pagesItemsTypeValue: 'pages',
  tabsAccessor: 'tabs',
  webItems: 'webItems',
  mobileItems: 'mobileItems',
  tabCollectionItemsAccessor: 'collectionItems',
};

const WidgetForm = ({ formRef, customInputs, onPrimaryButtonClick }: FormProps) => {
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
  } = useForm<any>({
    shouldUnregister: false,
    defaultValues: {
      backgroundColor: '#ffffff',
    },
  });
  const { switchClass, commonTranslations, baseUrl, token, widgetRoutesPrefix } = useProviderState();
  const {
    data,
    canAdd,
    canUpdate,
    formState,
    itemsTypes,
    widgetTypes,
    loading,
    languages,
    widgetTranslations,
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
  const [itemsEnabled, setItemsEnabled] = useState(true);
  const [webItemsVisible, setWebItemsVisible] = useState(false);
  const [mobileItemsVisible, setMobileItemsVisible] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<any>();
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
  const [blogCategory, setBlogCategory] = useState<OptionType | null>(null);
  const [blogLimit, setBlogLimit] = useState<number | undefined>(undefined);
  const [blogCategories, setBlogCategories] = useState<OptionType[]>([]);
  const [blogCategoriesLoading, setBlogCategoriesLoading] = useState(false);
  const pagesLoadedRef = useRef(false);
  const blogCategoryInitialized = useRef(false);

  useEffect(() => {
    if (data && formState === 'UPDATE') {
      const widgetType = widgetTypes.find(
        (type) => type.value === data?.widgetType
      );
      setSelectedWidgetType(widgetType);
      if (
        data?.itemsType !== constants.imageItemsTypeValue ||
        data?.widgetType === constants.textWidgetTypeValue ||
        data?.widgetType === constants.htmlWidgetTypeValue
      ) {
        setItemsEnabled(false);
      }
      if (
        data?.collectionName !== constants.imageItemsTypeValue &&
        itemsTypes &&
        itemsTypes.length > 0
      ) {
        setSelectedCollectionType(
          itemsTypes.find((item) => item.value === data?.collectionName)
        );
      }
      if (
        data?.widgetType === constants.textWidgetTypeValue ||
        data?.widgetType === constants.htmlWidgetTypeValue ||
        data?.widgetType === constants.linksWidgetTypeValue
      ) {
        setItemsEnabled(false);
      }
    }
  }, [data, formState, itemsTypes, widgetTypes]);

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

  // Watch itemsType for blog category feature
  const currentItemsType = watch(constants.itemTypeAccessor);

  // Fetch blog categories when itemsType is 'blogs'
  useEffect(() => {
    if (currentItemsType === 'blog' && blogCategories.length === 0) {
      const fetchBlogCategories = async () => {
        try {
          setBlogCategoriesLoading(true);
          const response = await request({
            baseUrl,
            token,
            method: 'GET',
            url: `${widgetRoutesPrefix}/blog-categories`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => console.error('Error fetching blog categories:', error),
          });
          if (response?.code === 'SUCCESS' && Array.isArray(response.data?.docs)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const categories = response.data.docs.map((cat: any) => ({
              value: cat._id || cat.id,
              label: cat.name || cat.nm || cat.label,
              slug: cat.slug,
            }));
            setBlogCategories(categories);
          }
        } catch (error) {
          console.error('Error fetching blog categories:', error);
        } finally {
          setBlogCategoriesLoading(false);
        }
      };
      fetchBlogCategories();
    }
  }, [currentItemsType, baseUrl, token, widgetRoutesPrefix, blogCategories.length]);

  // Set blog category and limit when editing a widget
  useEffect(() => {
    if (formState === 'UPDATE' && data && currentItemsType === 'blog' && blogCategories.length > 0 && !blogCategoryInitialized.current) {
      // Set blog category if it exists in the data
      if (data.blogCategory) {
        const savedCategory = blogCategories.find(cat => cat.value === data.blogCategory);
        if (savedCategory) {
          setBlogCategory(savedCategory);
          blogCategoryInitialized.current = true;
        }
      }
      // Set blog limit if it exists in the data
      if (data.blogLimit) {
        setBlogLimit(data.blogLimit);
      }
    }
  }, [formState, data, currentItemsType, blogCategories]);

  // Clear collectionItems when using blog category/limit (server will handle fetching latest blogs)
  useEffect(() => {
    if (currentItemsType === 'blog') {
      if (blogCategory || (blogLimit && blogLimit > 0)) {
        // Clear selected collection items since server will fetch latest blogs based on category/limit
        setSelectedCollectionItems([]);
        setCollectionItemsUpdated(true);
      }
    }
  }, [blogCategory, blogLimit, currentItemsType]);

  // Reset blog category and limit when itemsType changes away from 'blogs'
  useEffect(() => {
    if (currentItemsType !== 'blog') {
      setBlogCategory(null);
      setBlogLimit(undefined);
      setBlogCategories([]);
      blogCategoryInitialized.current = false;
    }
  }, [currentItemsType]);

  // Reset initialization flag when opening a different widget or changing form state
  useEffect(() => {
    blogCategoryInitialized.current = false;
  }, [data?._id, formState]);

  // Watch blogLimit form value and update state
  const watchedBlogLimit = watch('blogLimit');
  useEffect(() => {
    if (watchedBlogLimit && currentItemsType === 'blog') {
      const limit = parseInt(watchedBlogLimit) || 10;
      setBlogLimit(limit);
    }
  }, [watchedBlogLimit, currentItemsType]);

  // Load pages data when Links widget type is selected
  useEffect(() => {
    if (
      selectedWidgetType?.value === constants.linksWidgetTypeValue &&
      selectedCollectionType?.value === constants.pagesItemsTypeValue &&
      !pagesLoadedRef.current
    ) {
      // Trigger initial load of pages
      pagesLoadedRef.current = true;
      getCollectionData(constants.pagesItemsTypeValue, '');
    }
    // Reset ref when widget type changes away from Links
    if (selectedWidgetType?.value !== constants.linksWidgetTypeValue) {
      pagesLoadedRef.current = false;
    }
  }, [selectedWidgetType, selectedCollectionType, getCollectionData]);

  const onChangeSearch = (
    str?: string,
    callback?: (options: OptionType[]) => void,
    collectionName?: string
  ): any => {
    let collectionItems: any[] = [];
    let valueToSet = '';
    if (formState === 'UPDATE') {
      if (
        data[constants.widgetTypeAccessor] === constants.tabsWidgetTypeValue
      ) {
        collectionItems = data[constants.tabsAccessor][activeTab]
          ? data[constants.tabsAccessor][activeTab][
          constants.collectionItemsAccessor
          ]
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

    // Use passed collectionName or fall back to selectedCollectionType
    const collectionToUse = collectionName || selectedCollectionType?.value;

    callerRef.current = setTimeout(() => {
      if (collectionToUse)
        getCollectionData(
          collectionToUse,
          str,
          (options) => {
            if (typeof callback === 'function')
              callback(
                options.map((item: ObjectType) => ({
                  ...item,
                  value: item['_id'] || item['id'],
                  label: item['name'] || item['title'],
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
                      ...item,
                      value: item._id || item.id,
                      label: item.name || item.title,
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
          ? itemsTypes.filter(
            (item) => item.label !== constants.imageItemsTypeValue
          )
          : itemsTypes;
      const firstItemType = derivedItemTypes[0];
      setValue(constants.itemTypeAccessor, firstItemType?.value);
      return firstItemType;
    },
    [itemsTypes, setValue]
  );


  const getFirstWidgetTypeValue = useCallback(() => {
    return widgetTypes[0].value;
  }, [widgetTypes]);

  // Widget Form Functions
  const onWidgetFormInputChange = useCallback(
    (value: ObjectType, name: string | undefined) => {
      if (name === constants.widgetTypeAccessor) {
        const widgetType = widgetTypes.find(
          (type) => type.value === value[name]
        );
        setSelectedWidgetType(widgetType);

        if (
          widgetType?.value === constants.textWidgetTypeValue ||
          widgetType?.value === constants.htmlWidgetTypeValue
        ) {
          setItemsEnabled(false);
        } else if (widgetType?.value === constants.linksWidgetTypeValue) {
          setItemsEnabled(false);
          setValue(constants.itemTypeAccessor, constants.pagesItemsTypeValue);
          setValue(constants.collectionNameAccessor, constants.pagesItemsTypeValue);
          const pagesOption = itemsTypes.find(
            (item) => item.value === constants.pagesItemsTypeValue
          );
          if (pagesOption) setSelectedCollectionType(pagesOption);
        } else {
          setItemsEnabled(true);
        }

        if (
          widgetType?.value === constants.carouselWidgetTypeValue ||
          widgetType?.value === constants.fixedCardWidgetTypeValue
        ) {
          setValue(constants.itemTypeAccessor, "Image");
        }

        if (widgetType?.value === constants.tabsWidgetTypeValue) {
          const firstItemType = getFirstItemTypeValue(value[name]);
          if (firstItemType) {
            setSelectedCollectionType(firstItemType);
          }
          setValue(constants.itemTypeAccessor, firstItemType?.value);
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
    [getFirstItemTypeValue, itemsTypes, setValue, widgetTypes, selectedCollectionType]
  );
  const validateTabs = (tabsData: any) => {
    const isLanguagesProvided =
      Array.isArray(languages) && languages.length > 0;
    let isTabsValid = true;
    if (Array.isArray(tabsData) && tabsData.length > 0) {
      tabsData.forEach((tabItem: any, index: number) => {
        if (isLanguagesProvided) {
          languages.forEach((lang: any) => {
            if (!tabItem.names[lang.code]) {
              setError(`tabs.${index}.names.${lang.code}`, {
                type: 'manual',
                message: `${widgetTranslations.tabNameRequired} (${lang.name})`,
              });
              isTabsValid = false;
            }
          });
        } else if (!tabItem.name) {
          setError(`tabs.${index}.name`, {
            type: 'manual',
            message: widgetTranslations.tabNameRequired,
          });
          isTabsValid = false;
        }
      });
    }
    return isTabsValid;
  };
  const onFormSubmit = (data: CombineObjectType) => {
    const formData = { ...data };
    // setting widget type if undefined
    if (!formData[constants.widgetTypeAccessor] && formState === 'ADD') {
      formData[constants.widgetTypeAccessor] = getFirstWidgetTypeValue();
    }
    // setting tabs data if widgetType tab is selected
    const tabsData = getValues(constants.tabsAccessor);
    if (Array.isArray(tabsData) && tabsData.length > 0) {
      const isTabsValid = validateTabs(tabsData);
      if (!isTabsValid) return;
    }
    if (
      Array.isArray(tabsData) &&
      (formData[constants.widgetTypeAccessor] ===
        constants.tabsWidgetTypeValue ||
        formState === 'UPDATE')
    ) {
      formData[constants.tabsAccessor] = tabsData.map((tabItem) => ({
        name: tabItem.name,
        names: tabItem.names,
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
    // Force collectionName and itemsType for Links widget
    if (formData[constants.widgetTypeAccessor] === constants.linksWidgetTypeValue) {
      formData[constants.collectionNameAccessor] = constants.pagesItemsTypeValue;
      formData[constants.itemTypeAccessor] = constants.pagesItemsTypeValue;
    }
    // setting collectionName if widgetType is FixedCard or Carousel and FormState
    else if (
      formData[constants.itemTypeAccessor] !== constants.imageItemsTypeValue &&
      formState === 'ADD'
    ) {
      formData[constants.collectionNameAccessor] = selectedCollectionType
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
      formData[constants.collectionItemsAccessor] = selectedCollectionItems.map(
        (item) => item.value
      );
    }
    let items = [
      ...(getValues(constants.webItems) || []),
      ...(getValues(constants.mobileItems) || []),
    ];
    items = items.map(({ _id, __v, widgetId, ...item }) => {
      if (typeof item['imgs'] === 'object' && item['imgs']) {
        Object.keys(item['imgs']).forEach((key) => {
          if (item['imgs'][key] && item['imgs'][key]['_id']) {
            item['imgs'][key] = item['imgs'][key]['_id'];
          } else if (
            typeof item['imgs'][key] !== 'string' ||
            !item['imgs'][key]
          ) {
            delete item['imgs'][key];
          }
        });
      }
      if (item['img'] && item['img']['_id']) {
        item['img'] = item['img']['_id'];
      } else if (typeof item['img'] !== 'string' || !item['img']) {
        delete item['img'];
      }
      return item;
    });
    const submitPayload = {
      ...formData,
      items,
      // Include blog category and limit if set
      ...(blogCategory && { blogCategory: blogCategory.value }),
      ...(blogLimit && { blogLimit }),
    };
    onPrimaryButtonClick?.(undefined, submitPayload);
    onWidgetFormSubmit(submitPayload);
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
      label: commonTranslations.name,
      required: true,
      accessor: 'name',
      type: 'text',
      placeholder: commonTranslations.namePlaceholder,
      onInput: handleCapitalize,
      validations: {
        required: commonTranslations.nameRequired,
      },
      wrapperClassName: 'khb_grid-item-1of2 khb_padding-right-1 khb_align-top',
    },
    {
      label: commonTranslations.code,
      accessor: 'code',
      required: true,
      type: 'text',
      onInput: handleCode,
      editable: false,
      placeholder: commonTranslations.codePlaceholder,
      validations: {
        required: commonTranslations.codeRequired,
      },
      wrapperClassName:
        'khb_grid-item-1of2 khb_padding-left-1 khb_align-top khb_margin-top-0',
    },
    Array.isArray(languages) && languages.length > 0
      ? {
        label: commonTranslations.title,
        accessor: 'widgetTitles',
        required: false,
        type:
          customInputs && customInputs['widgetTitles'] ? undefined : 'text',
        info: widgetTranslations.widgetTitleInfo,
        placeholder: commonTranslations.titlePlaceholder,
        onInput: handleCapitalize,
        Input:
          customInputs && customInputs['widgetTitles']
            ? customInputs['widgetTitles']
            : undefined,
      }
      : {
        label: commonTranslations.title,
        accessor: 'widgetTitle',
        required: true,
        type:
          customInputs && customInputs['widgetTitle'] ? undefined : 'text',
        onInput: handleCapitalize,
        placeholder: commonTranslations.titlePlaceholder,
        validations: {
          required: commonTranslations.titleRequired,
        },
        info: widgetTranslations.widgetTitleInfo,
        Input:
          customInputs && customInputs['widgetTitle']
            ? customInputs['widgetTitle']
            : undefined,
      },
    {
      label: widgetTranslations.widgetType,
      required: true,
      editable: false,
      accessor: constants.widgetTypeAccessor,
      type: 'select',
      validations: {
        required: widgetTranslations.widgetTypeRequired,
      },
      options: widgetTypes,
    },
    {
      label: widgetTranslations.autoPlay,
      accessor: 'autoPlay',
      type: 'checkbox',
      show: selectedWidgetType?.value === constants.carouselWidgetTypeValue,
      switchClass: switchClass,
    },
    {
      label: widgetTranslations.textContent,
      accessor: 'textContent',
      required: selectedWidgetType?.value === constants.textWidgetTypeValue,
      type: customInputs && customInputs['textContent'] ? undefined : 'text',
      placeholder: widgetTranslations.textContentPlaceholder,
      validations: {
        required: widgetTranslations.textContentRequired,
      },
      info: widgetTranslations.textContentInfo,
      show: selectedWidgetType?.value === constants.textWidgetTypeValue,
      Input:
        customInputs && customInputs['textContent']
          ? customInputs['textContent']
          : undefined,
    },
    {
      label: widgetTranslations.htmlContent,
      accessor: 'htmlContent',
      required: selectedWidgetType?.value === constants.htmlWidgetTypeValue,
      type:
        customInputs && customInputs['htmlContent'] ? undefined : 'textarea',
      placeholder: widgetTranslations.htmlContentPlaceholder,
      validations: {
        required: widgetTranslations.htmlContentRequired,
      },
      show: selectedWidgetType?.value === constants.htmlWidgetTypeValue,
      Input:
        customInputs && customInputs['htmlContent']
          ? customInputs['htmlContent']
          : undefined,
    },
    {
      label: widgetTranslations.itemsType,
      required: true,
      editable: false,
      show:
        selectedWidgetType?.value !== constants.textWidgetTypeValue &&
        selectedWidgetType?.value !== constants.htmlWidgetTypeValue,
      accessor: constants.itemTypeAccessor,
      type: 'select',
      validations: {
        required: widgetTranslations.itemsTypePlaceholder,
      },
      options:
        selectedWidgetType?.value === constants.linksWidgetTypeValue
          ? itemsTypes.filter(
            (item) => item.value === constants.pagesItemsTypeValue
          )
          : selectedWidgetType?.value === constants.tabsWidgetTypeValue ||
            selectedWidgetType?.collectionsOnly
            ? itemsTypes.filter(
              (item) =>
                item.label !== constants.imageItemsTypeValue &&
                item.value !== constants.pagesItemsTypeValue &&
                item.value !== 'blog'
            )
            : selectedWidgetType?.imageOnly
              ? itemsTypes.filter(
                (item) => item.label === constants.imageItemsTypeValue
              )
              : itemsTypes.filter(
                (item) => item.value !== constants.pagesItemsTypeValue
              ),
    },
    {
      label: 'Blog Category',
      accessor: 'blogCategory',
      type: 'ReactSelect',
      selectedOptions: blogCategory ? [blogCategory] : [],
      isMulti: false,
      isSearchable: true,
      isClearable: true,
      onChange: (selected: OptionType | OptionType[] | null) => {
        setBlogCategory(Array.isArray(selected) ? selected[0] : selected);
      },
      loadOptions: (searchStr?: string, callback?: (options: OptionType[]) => void) => {
        // Filter categories based on search string
        if (!callback) return;
        const filtered = searchStr
          ? blogCategories.filter(cat =>
            cat.label.toLowerCase().includes(searchStr.toLowerCase())
          )
          : blogCategories;
        callback(filtered);
      },
      isLoading: blogCategoriesLoading,
      show:
        currentItemsType === 'blog' &&
        !itemsEnabled &&
        (selectedWidgetType?.value === constants.carouselWidgetTypeValue ||
          selectedWidgetType?.value === constants.fixedCardWidgetTypeValue ||
          !selectedWidgetType) &&
        !!selectedCollectionType?.value,
      placeholder: 'Select blog category...',
      wrapperClassName: 'khb_grid-item-1of2 khb_padding-right-1',
      customStyles: reactSelectStyles || {},
      selectKey: `blog-category-select-${blogCategories.length}`,
    },
    {
      label: 'No. of Blogs',
      accessor: 'blogLimit',
      type: 'select',
      options: [
        { value: '', label: 'Select number of blogs' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
      ],
      show:
        currentItemsType === 'blog' &&
        !itemsEnabled &&
        (selectedWidgetType?.value === constants.carouselWidgetTypeValue ||
          selectedWidgetType?.value === constants.fixedCardWidgetTypeValue ||
          !selectedWidgetType) &&
        !!selectedCollectionType?.value,
      wrapperClassName: 'khb_grid-item-1of2 khb_padding-left-1',
      required: true,
      validations: {
        required: 'Number of blogs is required',
      },
    },

    {
      label: widgetTranslations.webPerRow,
      accessor: 'webPerRow',
      type: 'number',
      show:
        selectedWidgetType?.value !== constants.textWidgetTypeValue &&
        selectedWidgetType?.value !== constants.htmlWidgetTypeValue,
      required: true,
      placeholder: widgetTranslations.webPerRowPlaceholder,
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-right-1',
      validations: {
        required: widgetTranslations.webPerRowRequired,
        min: {
          value: 1,
          message: widgetTranslations.minPerRow,
        },
      },
    },
    {
      label: widgetTranslations.tabletPerRow,
      accessor: 'tabletPerRow',
      type: 'number',
      show:
        selectedWidgetType?.value !== constants.textWidgetTypeValue &&
        selectedWidgetType?.value !== constants.htmlWidgetTypeValue,
      required: true,
      placeholder: widgetTranslations.tabletPerRowPlaceholder,
      wrapperClassName: 'khb_grid-item-1of3 khb_padding-left-1',
      validations: {
        required: widgetTranslations.tabletPerRowRequired,
        min: {
          value: 1,
          message: widgetTranslations.minPerRow,
        },
      },
    },
    {
      label: widgetTranslations.mobilePerRow,
      accessor: 'mobilePerRow',
      type: 'number',
      show:
        selectedWidgetType?.value !== 'Text' &&
        selectedWidgetType?.value !== 'HTML',
      required: true,
      placeholder: widgetTranslations.mobilePerRowPlaceholder,
      wrapperClassName:
        'khb_grid-item-1of3 khb_padding-right-1 khb_padding-left-1',
      validations: {
        required: widgetTranslations.mobilePerRowRequired,
        min: {
          value: 1,
          message: widgetTranslations.minPerRow,
        },
      },
    },
    {
      label: selectedCollectionType?.label,
      placeholder: `Select ${selectedCollectionType?.label}...`,
      accessor: constants.collectionItemsAccessor,
      type: 'ReactSelect',
      options: collectionData,
      selectedOptions: selectedCollectionItems,
      isMulti: true,
      isSearchable: true,
      onChange: setSelectedCollectionItems,
      loadOptions: onChangeSearch,
      isLoading: collectionDataLoading,
      disabled: currentItemsType === 'blog' && !!blogCategory,
      show:
        !itemsEnabled &&
        currentItemsType !== 'blog' &&
        (selectedWidgetType?.value === constants.carouselWidgetTypeValue ||
          selectedWidgetType?.value === constants.fixedCardWidgetTypeValue ||
          selectedWidgetType?.value === constants.linksWidgetTypeValue ||
          !selectedWidgetType) && !!selectedCollectionType?.value,
      formatOptionLabel: formatOptionLabel,
      listCode: selectedCollectionType?.value,
      customStyles: reactSelectStyles || {},
      selectKey: selectedCollectionType?.value,
    },
    {
      label: widgetTranslations.color,
      accessor: 'backgroundColor',
      type: 'color',
      className: 'khb_input-color',
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
        languages={languages}
      />

      {selectedWidgetType?.value === constants.tabsWidgetTypeValue ? (
        <Tabs
          clearErrors={clearErrors}
          getValues={getValues}
          setValue={setValue}
          control={control}
          languages={languages}
          deleteTitle={widgetTranslations.tabDeleteTitle}
          yesButtonText={commonTranslations.yes}
          noButtonText={commonTranslations.cancel}
          errors={errors}
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

      {!itemsEnabled &&
        selectedWidgetType?.value !== constants.tabsWidgetTypeValue && (
          <DNDItemsList
            items={selectedCollectionItems}
            onDragEnd={onCollectionIndexChange}
            formatItem={formatListItem}
            listCode={selectedCollectionType?.value}
          />
        )}

      {itemsEnabled &&
        (selectedCollectionType === undefined ||
          selectedWidgetType.value === 'Carousel' ||
          selectedWidgetType.value === 'FixedCard') && (
          <>
            {/* Web Items */}
            <ItemsAccordian
              languages={languages}
              clearError={clearErrors}
              collapseId={constants.webItems}
              title={widgetTranslations.webItems}
              id={constants.webItems}
              setError={setError}
              show={
                webItemsVisible || !!(errors && errors?.[constants.webItems])
              }
              toggleShow={setWebItemsVisible}
              itemType="Web"
              name={constants.webItems}
              errors={errors}
              control={control}
              register={register}
              loading={loading}
              addText={commonTranslations.add}
              deleteText={commonTranslations.delete}
            />

            {/* Mobile Items */}
            <ItemsAccordian
              languages={languages}
              clearError={clearErrors}
              collapseId={constants.mobileItems}
              title={widgetTranslations.mobileItems}
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
              addText={commonTranslations.add}
              deleteText={commonTranslations.delete}
            />
          </>
        )}
    </div>
  );
};

export default WidgetForm;
