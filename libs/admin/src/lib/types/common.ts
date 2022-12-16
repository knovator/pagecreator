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
  [key: string]:
    | string
    | boolean
    | number
    | string[]
    | null
    | Record<string | number, CombineObjectType>
    | CombineObjectType
    | CombineObjectType[];
};
export type ValuesType = string | boolean | number | string[];
export interface SrcSetItem {
  screenSize: number | string;
  width: number | string;
  height: number | string;
}
