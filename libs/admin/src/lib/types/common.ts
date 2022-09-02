export type FormActionTypes = 'ADD' | 'UPDATE' | 'DELETE' | null | '';
export type TFunc = (key: string) => string;
export type OptionType = { label: string; value: string };
export interface PermissionsObj {
  list: boolean;
  add: boolean;
  update: boolean;
  partialUpdate: boolean;
  delete: boolean;
}
export type ObjectType = {
  [key: string]: string;
};
export type CombineObjectType = {
  [key: string]: string | boolean | number | string[] | null | ObjectType;
};
export type ValuesType = string | boolean | number | string[];
