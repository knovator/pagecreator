/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { PAGE_LIMITS, TRANSLATION_PAIRS_COMMON } from '../constants/common';
import { ObjectType, PageContextType } from '../types';

interface PageContextProviderProps
  extends React.PropsWithChildren,
    Partial<PageContextType> {}

const PageContext = createContext<PageContextType | null>(null);

const PageContextProvider = ({
  t = (key: string) =>
    ((
      {
        ...TRANSLATION_PAIRS_COMMON,
      } as ObjectType
    )[key]),
  // Form
  list = [],
  widgets = [],
  formState = '',
  closeForm = () => {},
  getPages = () => {},
  loading = false,
  getWidgets = () => {},
  onChangeFormState = () => {},
  onPageFormSubmit = () => {},
  canAdd = false,
  canUpdate = false,
  selectedWidgets = [],
  setSelectedWidgets = () => {},
  onChangeWidgetSequence = () => {},
  // Pagination
  currentPage = 1,
  limits = PAGE_LIMITS,
  pageSize = PAGE_LIMITS[0],
  setCurrentPage = () => {},
  setPageSize = () => {},
  totalPages = 0,
  totalRecords = 0,
  canList = false,
  // Table
  columns = [],
  data = [],
  canDelete = false,
  loader = undefined,
  // other
  children,
}: PageContextProviderProps) => {
  return (
    <PageContext.Provider
      value={{
        t,
        // Form
        list,
        widgets,
        closeForm,
        formState,
        loading,
        getWidgets,
        onChangeFormState,
        canAdd,
        canUpdate,
        onPageFormSubmit,
        selectedWidgets,
        setSelectedWidgets,
        onChangeWidgetSequence,
        // Pagination
        getPages,
        currentPage,
        limits,
        pageSize,
        setCurrentPage,
        setPageSize,
        totalPages,
        totalRecords,
        canList,
        // Table
        columns,
        data,
        canDelete,
        loader,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export function usePageState() {
  const context = useContext(PageContext);
  if (!context)
    throw new Error('Page Context must be used within PageContext.Provider');

  return context;
}

export default PageContextProvider;
