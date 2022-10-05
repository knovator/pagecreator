import React, { MutableRefObject } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { RegisterOptions } from 'react-hook-form';
import { Routes_Input } from './api';
import {
  OptionType,
  FormActionTypes,
  PermissionsObj,
  ObjectType,
} from './common';

export interface DNDItemsListProps {
  onDragEnd: (result: DropResult) => void;
  items: OptionType[];
  listCode?: string;
  formatItem?: (code: string, data: any) => JSX.Element;
}
export interface DrawerProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  id?: string;
  name?: string;
  title?: string;
}
export type ButtonTypes = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSizes = 'xs' | 'sm' | 'base' | 'lg';
export interface ButtonProps {
  children?: React.ReactNode;
  type?: ButtonTypes;
  size?: ButtonSizes;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export interface IconProps {
  srText?: string;
  className?: string;
}
export type InputSizes = 'xs' | 'sm' | 'base' | 'lg';
export interface InputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: InputSizes;
  className?: string;
  error?: string;
  errors?: any;
  required?: boolean;
  disabled?: boolean;
  rest?: any;
  wrapperClassName?: string;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  control?: any;
  register?: any;
}
export interface CheckboxProps {
  rest?: any;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  switchClass?: string;
}
export interface SelectProps {
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
export interface ReactSelectProps {
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
export interface FormProps {
  formRef: MutableRefObject<HTMLFormElement | null>;
}
export interface InputRendererProps {
  field: import('react-hook-form').ControllerRenderProps;
  error?: string;
  setError: (msg: string) => void;
  disabled?: boolean;
}
export interface WidgetProps {
  t?: any;
  loader?: any;
  routes?: Routes_Input;
  explicitForm?: boolean;
  permissions?: PermissionsObj;
  formatListItem?: (code: string, data: any) => JSX.Element;
  formatOptionLabel?: (code: string, data: any) => JSX.Element;
  preConfirmDelete?: (data: { row: ObjectType }) => Promise<boolean>;
  children?: JSX.Element;
}

export interface FormWrapperProps {
  children: (data: {
    formState: FormActionTypes | undefined;
    onClose: () => void;
    open: boolean;
  }) => JSX.Element | null;
}
export interface FormActionWrapperProps {
  formRef: MutableRefObject<HTMLFormElement | null>;
}

export interface SchemaType extends ReactSelectProps {
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
    | 'ReactSelect'
    | 'srcset';
  options?: { value: string; label: string }[];
  selectedOptions?: { value: string; label: string }[];
  isMulti?: boolean;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  show?: boolean;
  wrapperClassName?: string;
  switchClass?: string;
}
export interface PageProps {
  t?: any;
  loader?: any;
  explicitForm?: boolean;
  permissions?: PermissionsObj;
  children?: JSX.Element;
}
export interface PaginationProps {
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (value: number) => void;
  showingText?: string;
  pageText?: string;
  ofText?: string;
}
export interface TileItemsAccordianProps {
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
export interface ImageUploadProps {
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
export interface ToggleProps {
  isChecked?: boolean;
  disabled?: boolean;
  onChange?: (status: boolean) => void;
  switchClass?: string;
}
export interface DeleteModalProps {
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
export type CellInputType = (parameters: {
  row: any;
  onUpdate?: (row: any) => void;
}) => JSX.Element | null | string;
export type TableDataItemFormat = {
  label: string;
  dataKey: string;
  highlight?: boolean;
  Cell?: CellInputType;
};
export interface TableProps {
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
