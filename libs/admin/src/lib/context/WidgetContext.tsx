/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { PAGE_LIMITS, TRANSLATION_PAIRS_WIDGET } from '../constants/common';
import { WidgetContextType } from '../types';

interface WidgetContextProviderProps
  extends React.PropsWithChildren,
    Partial<WidgetContextType> {}

const WidgetContext = createContext<WidgetContextType | null>(null);

const WidgetContextProvider = ({
  // Form
  list = [],
  languages = [],
  imageBaseUrl = '',
  searchText = '',
  changeSearch = () => {},
  formState = '',
  closeForm = () => {},
  loading = false,
  onChangeFormState = () => {},
  onWidgetFormSubmit = () => {},
  updateData = null,
  canAdd = false,
  canUpdate = false,
  onDeleteItem = () => {},
  getWidgets = () => {},
  onImageUpload = async (file: File) => {},
  onImageRemove = async (id: string) => {},
  itemsTypes = [],
  widgetTypes = [],
  getCollectionData = () => Promise.resolve(),
  collectionDataLoading = false,
  collectionData = [],
  formatListItem,
  formatOptionLabel,
  // Pagination
  currentPage = 1,
  limits = PAGE_LIMITS,
  pageSize = PAGE_LIMITS[0],
  setCurrentPage = () => {},
  setPageSize = () => {},
  totalPages = 0,
  totalRecords = 0,
  // Table
  canList = false,
  canPartialUpdate = false,
  columns = [],
  data = [],
  canDelete = false,
  loader = <span />,
  onPartialUpdateWidget = () => Promise.resolve(),
  reactSelectStyles = {},
  imageMaxSize = 10_485_760,
  widgetTranslations,
  // other
  children,
}: WidgetContextProviderProps) => {
  return (
    <WidgetContext.Provider
      value={{
        // Form
        list,
        languages,
        imageBaseUrl,
        closeForm,
        formState,
        loading,
        searchText,
        changeSearch,
        onChangeFormState,
        onWidgetFormSubmit,
        updateData,
        canAdd,
        canUpdate,
        onDeleteItem,
        getWidgets,
        onImageUpload,
        onImageRemove,
        onPartialUpdateWidget,
        itemsTypes,
        widgetTypes,
        getCollectionData,
        collectionDataLoading,
        collectionData,
        formatListItem,
        formatOptionLabel,
        reactSelectStyles,
        // Pagination
        currentPage,
        limits,
        pageSize,
        setCurrentPage,
        setPageSize,
        totalPages,
        totalRecords,
        // Table
        canList,
        canPartialUpdate,
        columns,
        data,
        canDelete,
        loader,
        imageMaxSize,
        widgetTranslations: {
          ...TRANSLATION_PAIRS_WIDGET,
          ...(widgetTranslations || {}),
        },
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export function useWidgetState() {
  const context = useContext(WidgetContext);
  if (!context)
    throw new Error(
      'Widget Context must be used within WidgetContext.Provider'
    );

  return context;
}

export default WidgetContextProvider;
