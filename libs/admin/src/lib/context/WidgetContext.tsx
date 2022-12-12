/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { PAGE_LIMITS } from '../constants/common';
import { WidgetContextType } from '../types';

interface WidgetContextProviderProps
  extends React.PropsWithChildren,
    Partial<WidgetContextType> {}

const WidgetContext = createContext<WidgetContextType | null>(null);

const WidgetContextProvider = ({
  t = () => '',
  // Form
  list = [],
  formState = '',
  closeForm = () => {},
  loading = false,
  onChangeFormState = () => {},
  onWidgetFormSubmit = () => {},
  updateData = null,
  canAdd = false,
  canUpdate = false,
  onDeleteTile = () => {},
  getWidgets = () => {},
  onImageUpload = async (file: File) => {},
  onImageRemove = async (id: string) => {},
  itemsTypes = [],
  selectionTypes = [],
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
  // Tile
  webTiles = [],
  mobileTiles = [],
  tilesLoading = false,
  onTileFormSubmit = () => {},
  // other
  children,
}: WidgetContextProviderProps) => {
  return (
    <WidgetContext.Provider
      value={{
        t,
        // Form
        list,
        closeForm,
        formState,
        loading,
        onChangeFormState,
        onWidgetFormSubmit,
        updateData,
        canAdd,
        canUpdate,
        onDeleteTile,
        getWidgets,
        onImageUpload,
        onImageRemove,
        onPartialUpdateWidget,
        itemsTypes,
        selectionTypes,
        getCollectionData,
        collectionDataLoading,
        collectionData,
        formatListItem,
        formatOptionLabel,
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
        // Tile
        webTiles,
        mobileTiles,
        tilesLoading,
        onTileFormSubmit,
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
