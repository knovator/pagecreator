import { WidgetType, ItemsType } from './api';
import { FormActionTypes, LanguageType, OptionType } from './common';
import { WidgetTranslationPairs, PageTranslationPairs } from './components';

export interface CommonTranslationPairs {
  confirmationRequired: string;
  permanentlyDelete: string;
  lossOfData: string;
  pleaseType: string;
  toProceedOrCancel: string;
  confirm: string;
  next: string;
  previous: string;
  page: string;
  indicatesRequired: string;
  cancel: string;
  yes: string;
  delete: string;
  create: string;
  update: string;
  showing: string;
  add: string;
  of: string;
  typeHerePlaceholder: string;

  code: string;
  codePlaceholder: string;
  codeRequired: string;
  name: string;
  namePlaceholder: string;
  nameRequired: string;
  title: string;
  titlePlaceholder: string;
  titleRequired: string;

  active: string;
  actions: string;
}

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
  commonTranslations: CommonTranslationPairs;
  widgetRoutesPrefix: string;
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
      | 'commonTranslations'
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
  translations?: Partial<CommonTranslationPairs>;
}

export interface WidgetContextType {
  // Form
  list: any[];
  languages: LanguageType[];
  searchText?: string;
  changeSearch: (str: string) => void;
  formState: FormActionTypes | undefined;
  closeForm: () => void;
  onWidgetFormSubmit: (data: any) => void;
  onChangeFormState: (status: FormActionTypes, data?: any) => void;
  updateData: any;
  loading: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  onDeleteItem: (id: string) => void;
  getWidgets: (searchText?: string) => void;
  onImageUpload: (
    file: File
  ) => Promise<{ fileUrl: string; fileId: string; fileUri: string } | void>;
  onImageRemove: (id: string) => Promise<void>;
  itemsTypes: ItemsType[];
  widgetTypes: WidgetType[];
  getCollectionData: (
    collectionName: string,
    search?: string,
    callback?: (options: OptionType[]) => void,
    collectionItems?: string[]
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
  reactSelectStyles?: any;
  imageBaseUrl?: string;
  imageMaxSize: number;
  widgetTranslations: WidgetTranslationPairs;
}

export interface PageContextType {
  // Form
  list: any[];
  searchText: string;
  changeSearch: (val: string) => void;
  getWidgets: (
    search: string,
    collectionItems: string[],
    callback?: (data: any) => void
  ) => void;
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
  pageTranslations: PageTranslationPairs;
}
