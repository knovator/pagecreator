import { WidgetType, ItemsType } from './api';
import { FormActionTypes, OptionType } from './common';

export interface ProviderContextType {
  baseUrl: string;
  token: string | (() => Promise<string>);
  onError: (
    callback_code: import('../constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onSuccess: (
    callback_code: import('../constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  switchClass: string;
  onLogout: () => void;
  widgetRoutesPrefix: string;
  itemsRoutesPrefix: string;
  pageRoutesPrefix: string;
}
export interface ProviderContextProviderProps
  extends React.PropsWithChildren,
    Omit<
      ProviderContextType,
      | 'onError'
      | 'onSuccess'
      | 'onLogout'
      | 'widgetRoutesPrefix'
      | 'itemsRoutesPrefix'
      | 'pageRoutesPrefix'
      | 'switchClass'
    > {
  onError?: (
    callback_code: import('../constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onSuccess?: (
    callback_code: import('../constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onLogout?: () => void;
  switchClass?: string;
  widgetRoutesPrefix?: string;
  itemsRoutesPrefix?: string;
  pageRoutesPrefix?: string;
}
export interface WidgetContextType {
  t: (key: string) => string;
  // Form
  list: any[];
  formState: FormActionTypes | undefined;
  closeForm: () => void;
  onWidgetFormSubmit: (data: any) => void;
  onChangeFormState: (status: FormActionTypes, data?: any) => void;
  updateData: any;
  loading: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  onDeleteItem: (id: string) => void;
  getWidgets: (searchText: string) => void;
  onImageUpload: (
    file: File
  ) => Promise<{ fileUrl: string; fileId: string; fileUri: string } | void>;
  onImageRemove: (id: string) => Promise<void>;
  itemsTypes: ItemsType[];
  widgetTypes: WidgetType[];
  getCollectionData: (
    collectionName: string,
    search?: string,
    callback?: (options: OptionType[]) => void
  ) => Promise<void>;
  collectionDataLoading: boolean;
  collectionData: any[];
  formatListItem?: (code: string, data: any) => JSX.Element;
  formatOptionLabel?: (code: string, data: any) => JSX.Element;
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalRecords: number;
  limits: number[];
  // Table
  canList: boolean;
  canPartialUpdate: boolean;
  columns: any[]; //ColumnsSchema
  data: any;
  loader?: JSX.Element;
  canDelete?: boolean;
  onPartialUpdateWidget: (data: any, id: string) => Promise<void>;
  // Item
  webItems: any[];
  mobileItems: any[];
  itemsLoading: boolean;
  onItemFormSubmit: (state: FormActionTypes, data: any) => void;
  reactSelectStyles?: any;
}

export interface PageContextType {
  t: (key: string) => string;
  // Form
  list: any[];
  formState: FormActionTypes | undefined;
  closeForm: () => void;
  onPageFormSubmit: (data: any) => void;
  onChangeFormState: (status: FormActionTypes, data?: any) => void;
  loading: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  widgets: any[];
  selectedWidgets: OptionType[];
  setSelectedWidgets: (widgets: OptionType[]) => void;
  onChangeWidgetSequence: (
    souceIndex: number,
    destinationIndex: number
  ) => void;
  getPages: (searchText: string) => void;
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalRecords: number;
  limits: number[];
  // Table
  canList: boolean;
  columns: any[]; //ColumnsSchema
  data: any;
  loader?: JSX.Element;
  canDelete?: boolean;
}
