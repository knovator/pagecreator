import {
  Document,
  Model,
  Types,
  FilterQuery,
  QueryOptions,
  HydratedDocument,
} from 'mongoose';
import { WidgetType, SelectionTypes, TileTypes } from '.';

export type TypesType = { value: string; label: string };
// export type CollectionItem = {
//   title: string;
//   collectionName: string;
//   filters?: { [key: string]: string };
//   searchColumns: string[];
// };
export interface iConfig {
  logger: any;
  catchAsync: (
    fn: any,
    modal?: string
  ) => (req: any, res: any, next: any) => void;
  collections: CollectionItem[];
}
// Collection
export interface IPageSchema extends Document {
  name: string;
  code: string;
  widgets: string[];
}
export interface ISrcSetSchema extends Document {
  width: number;
  height: number;
  screenSize: number;
  tileId: typeof Types.ObjectId;
}
export interface IWidgetSchema extends Document {
  tiles: any;
  name: string;
  code: string;
  autoPlay: boolean;
  isActive: boolean;
  widgetTitle: string;
  webPerRow: number;
  mobilePerRow: number;
  tabletPerRow: number;
  widgetType: WidgetType;
  selectionType: SelectionTypes;
  collectionName: string;
  collectionItems: string[];
}
export interface ITileSchema extends Document {
  widgetId: typeof Types.ObjectId;
  title: string;
  altText: string;
  link: string;
  sequence: number;
  tileType: TileTypes;
  img: any;
  srcset?: SrcSetItem[];
}
export interface SrcSetItem {
  screenSize: number;
  width: number;
  height: number;
}
// \ End of Collection

export type CollectionItem = {
  title: string;
  collectionName: string;
  filters?: { [key: string]: string | number | boolean };
  searchColumns?: string[];
  match?: ObjectType;
  project?: ObjectType;
  lookup?: ObjectType;
};

export interface IConfig {
  logger: any;
  catchAsync: (
    fn: any,
    modal?: string
  ) => (req: any, res: any, next: any) => void;
  collections: CollectionItem[];
}

export type EntityType =
  | IWidgetSchema
  | ITileSchema
  | IPageSchema
  | ISrcSetSchema;
export type ReturnDocument = EntityType;
export interface IModel<T> extends Model<T> {
  paginate: (
    query: FilterQuery<T>,
    options?: QueryOptions
  ) => Promise<HydratedDocument<ReturnDocument>[]>;
}

export type ObjectType = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | string[]
    | number[]
    | ObjectType
    | ObjectType[]
    | any;
};

export interface IDefaultValidations {
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  deletedAt: string;
}

// helper.ts
export interface IWidgetDataSchema {
  _id: string;
  code: string;
  collectionName: string;
  collectionItems: string[];
}
export type IWidgetData = { [key: string]: IWidgetDataSchema };