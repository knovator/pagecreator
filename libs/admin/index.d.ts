/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@knovator/api';

// Admin-Interfaces
// Hooks
type FormActionTypes = 'ADD' | 'UPDATE' | 'DELETE' | null | '';
type TFunc = (key: string) => string;
type OptionType = { label: string; value: string };
interface PermissionsObj {
  list: boolean;
  add: boolean;
  update: boolean;
  partialUpdate: boolean;
  delete: boolean;
}
type ObjectType = {
  [key: string]: string;
};
type CombineObjectType = {
  [key: string]: string | boolean | number | string[] | null | ObjectType;
};
type ValuesType = string | boolean | number | string[];

// API
type WidgetType = { value: string; label: string };
type SelectionType = { value: string; label: string };
type ACTION_TYPES =
  | 'IMAGE_UPLOAD'
  | 'IMAGE_REMOVE'
  | 'CREATE'
  | 'LIST'
  | 'DELETE'
  | 'UPDATE'
  | 'TILES'
  | 'PARTIAL_UPDATE'
  | 'WIDGET_TYPES'
  | 'SELECTION_TYPES'
  | 'COLLECTION_DATA';

interface BaseAPIProps {
  config?: any;
  baseUrl: string;
  token: string | (() => Promise<string>);
  data?: any;
  url: string;
  method: string;
  onError?: (error: Error) => void;
}

type API_TYPE = {
  url: string;
  method: string;
};

type API_INPUT_TYPE = { prefix: string; id?: string };

type Routes_Input = {
  [K in ACTION_TYPES]?: (data: API_INPUT_TYPE) => API_TYPE;
};

// components
interface DNDItemsListProps {
  onDragEnd: (result: DropResult) => void;
  items: OptionType[];
  listCode?: string;
  formatItem?: (code: string, data: any) => JSX.Element;
}
interface DrawerProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  id?: string;
  name?: string;
  title?: string;
}
type ButtonTypes = 'primary' | 'secondary' | 'success' | 'danger';
type ButtonSizes = 'xs' | 'sm' | 'base' | 'lg';
interface ButtonProps {
  children?: React.ReactNode;
  type?: ButtonTypes;
  size?: ButtonSizes;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
interface IconProps {
  srText?: string;
  className?: string;
}
type InputSizes = 'xs' | 'sm' | 'base' | 'lg';
interface InputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: InputSizes;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rest?: any;
  wrapperClassName?: string;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
interface CheckboxProps {
  rest?: any;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  wrapperClassName?: string;
}
interface SelectProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  size?: InputSizes;
  id?: string;
  rest?: any;
  required?: boolean;
  wrapperClassName?: string;
}
interface ReactSelectProps {
  onChange?: (opt: OptionType[] | OptionType | null) => void;
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  id?: string;
  isMulti?: boolean;
  required?: boolean;
  selectedOptions?: { value: string; label: string }[];
  isLoading?: boolean;
  isSearchable?: boolean;
  onSearch?: (text: string) => void;
  placeholder?: string;
  formatOptionLabel?: (code: string, data: any) => JSX.Element;
  listCode?: string;
  wrapperClassName?: string;
}
interface SchemaType extends ReactSelectProps {
  label?: string;
  accessor: string;
  Input?: (props: InputRendererProps) => JSX.Element;
  validations?: import('react-hook-form').RegisterOptions;
  editable?: boolean;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?:
    | 'text'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'url'
    | 'ReactSelect';
  options?: { value: string; label: string }[];
  selectedOptions?: { value: string; label: string }[];
  isMulti?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  show?: boolean;
  wrapperClassName?: string;
}
interface FormProps {
  open: boolean;
  onClose: () => void;
  formState: FormActionTypes | undefined;
}
interface InputRendererProps {
  field: import('react-hook-form').ControllerRenderProps;
  error?: string;
  setError: (msg: string) => void;
  disabled?: boolean;
}
interface WidgetProps {
  t?: any;
  loader?: any;
  permissions?: PermissionsObj;
  formatListItem?: (code: string, data: any) => JSX.Element;
  formatOptionLabel?: (code: string, data: any) => JSX.Element;
}
interface SchemaType extends ReactSelectProps {
  label?: string;
  accessor: string;
  Input?: (props: InputRendererProps) => JSX.Element;
  validations?: RegisterOptions;
  editable?: boolean;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?:
    | 'text'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'url'
    | 'ReactSelect';
  options?: { value: string; label: string }[];
  selectedOptions?: { value: string; label: string }[];
  isMulti?: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  show?: boolean;
  wrapperClassName?: string;
}
interface PageProps {
  t?: any;
  loader?: any;
  permissions?: PermissionsObj;
}
interface PaginationProps {
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (value: number) => void;
  showingText?: string;
  pageText?: string;
  ofText?: string;
}
interface TileItemsAccordianProps {
  id: string;
  show: boolean;
  title: string;
  tilesData: any[];
  widgetId: string;
  collapseId: string;
  schema: SchemaType[];
  tileType: 'Web' | 'Mobile';
  toggleShow: (status: boolean) => void;
  onDataSubmit: (state: FormActionTypes, data: any, updateId?: string) => void;
  onDelete: (id: string) => void;
  addText?: string;
  editText?: string;
  cancelText?: string;
  deleteText?: string;
  saveText?: string;
}
interface ImageUploadProps {
  className?: string;
  text: string | JSX.Element;
  maxSize: number;
  imgId?: string | ObjectType;
  setImgId: (value?: string | null) => void;
  clearError?: () => void;
  onError: (msg: string) => void;
  onImageUpload: (
    file: File
  ) => Promise<{ fileUrl: string; fileId: string; fileUri: string } | void>;
  onImageRemove?: (id: string) => Promise<void>;
  baseUrl: string;
  error?: string;
  disabled?: boolean;
}
interface ToggleProps {
  isChecked?: boolean;
  disabled?: boolean;
  onChange?: (status: boolean) => void;
}
interface DeleteModalProps {
  formState: FormActionTypes | undefined;
  onClose: () => void;
  itemData: ObjectType;
  onConfirmDelete: () => void;
  permanentlyDelete?: string;
  lossOfData?: string;
  pleaseType?: string;
  toProceedOrCancel?: string;
  confirm?: string;
}
// Table
type CellInputType = (parameters: {
  row: any;
  onUpdate?: (row: any) => void;
}) => JSX.Element | null | string;
type TableDataItemFormat = {
  label: string;
  dataKey: string;
  highlight?: boolean;
  Cell?: CellInputType;
};
interface TableProps {
  data: any[];
  dataKeys: TableDataItemFormat[];
  loading?: boolean;
  loader?: any;
  actions?: {
    edit?: (data: { [key: string]: any }) => void;
    delete?: (data: { [key: string]: any }) => void;
  };
}
// \ End Table

interface ProviderContextType {
  baseUrl: string;
  token: string | (() => Promise<string>);
  onError: (
    callback_code: import('./src/constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onSuccess: (
    callback_code: import('./src/constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onLogout: () => void;
  widgetRoutesPrefix: string;
  tilesRoutesPrefix: string;
  pageRoutesPrefix: string;
}
interface ProviderContextProviderProps
  extends React.PropsWithChildren,
    Omit<
      ProviderContextType,
      | 'onError'
      | 'onSuccess'
      | 'onLogout'
      | 'widgetRoutesPrefix'
      | 'tilesRoutesPrefix'
      | 'pageRoutesPrefix'
    > {
  onError?: (
    callback_code: import('./src/constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onSuccess?: (
    callback_code: import('./src/constants/common').CALLBACK_CODES,
    code: string,
    message: string
  ) => void;
  onLogout?: () => void;
  widgetRoutesPrefix?: string;
  tilesRoutesPrefix?: string;
  pageRoutesPrefix?: string;
}
interface WidgetContextType {
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
  onDeleteTile: (id: string) => void;
  getWidgets: (searchText: string) => void;
  onImageUpload: (
    file: File
  ) => Promise<{ fileUrl: string; fileId: string; fileUri: string } | void>;
  onImageRemove: (id: string) => Promise<void>;
  widgetTypes: WidgetType[];
  selectionTypes: SelectionType[];
  getCollectionData: (collectionName: string, search?: string) => Promise<void>;
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
  // Tile
  tilesList: { [key: string]: any };
  tilesLoading: boolean;
  onTileFormSubmit: (state: FormActionTypes, data: any) => void;
}

interface PageContextType {
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
