import {
  Document,
  Model,
  Models,
  Types,
  FilterQuery,
  QueryOptions,
  HydratedDocument,
} from 'mongoose';
import { ItemsType, WidgetTypes, ItemTypes } from '.';

export type TypesType = { value: string; label: string };

export type LanguageSchemaFieldType = { [key: string]: string };

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
  slug: string;
  isActive: boolean;
  canDel: boolean;
  widgets: string[];
  filterQuery: string;
}
export interface ITabSchema extends Document {
  name: string;
  names: LanguageSchemaFieldType;
  widgetId: typeof Types.ObjectId;
  collectionItems: string[];
}
export interface ISrcSetSchema extends Document {
  width: number;
  height: number;
  screenSize: number;
  itemId: typeof Types.ObjectId;
}
export interface IWidgetSchema extends Document {
  items: any;
  name: string;
  code: string;
  autoPlay: boolean;
  isActive: boolean;
  widgetTitle: string;
  widgetTitles: LanguageSchemaFieldType;
  widgetSubtitle?: string;
  widgetSubtitles?: LanguageSchemaFieldType;
  webPerRow: number;
  mobilePerRow: number;
  tabletPerRow: number;
  itemsType: ItemsType;
  widgetType: WidgetTypes | string;
  collectionName: string;
  collectionItems: string[];
  blogCategory?: string;
  blogLimit?: number;
  tabs: {
    name: string;
    names?: LanguageSchemaFieldType;
    collectionItems: string[];
  }[];
  backgroundColor: string;
  textContent: string;
  htmlContent: string;
  canDel: boolean;
}
export interface IItemSchema extends Document {
  widgetId: typeof Types.ObjectId;
  title: string;
  titles: LanguageSchemaFieldType;
  subtitle: string;
  subtitles: LanguageSchemaFieldType;
  quote?: string;
  question?: string;
  answer?: string;
  personName?: string;
  personRole?: string;
  personOrganization?: string;
  rating?: number;
  altText: string;
  altTexts: LanguageSchemaFieldType;
  link: string;
  sequence: number;
  itemType: ItemTypes;
  img: any;
  imgs: any;
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
  filters?: { [key: string]: string | number | boolean | ObjectType };
  /** Dynamic filters function - receives request object and returns filters */
  getFilters?: (req: any) => { [key: string]: any };
  searchColumns?: string[];
  match?: ObjectType;
  /** Dynamic match function - receives request object and returns match query for aggregation */
  getMatch?: (req: any) => ObjectType;
  aggregations?: any[];
  searchLimit?: number;
};

export type RedisConfig = {
  HOST: string;
  PORT: number;
  PASSWORD?: string;
  USER?: string;
  DB?: number;
};

export interface IConfig {
  logger: any;
  catchAsync: (
    fn: any,
    modal?: string
  ) => (req: any, res: any, next: any) => void;
  getModals: (req: Express.Request) => Models;
  collections: CollectionItem[];
  customWidgetTypes: {
    label: string;
    value: string;
    imageOnly?: boolean;
    collectionsOnly?: boolean;
  }[];
  redis?: string | RedisConfig;
  languages?: LanguageType[];
}

export type EntityType =
  | IWidgetSchema
  | IItemSchema
  | IPageSchema
  | ISrcSetSchema
  | ITabSchema;
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
  tabs: { name: string; collectionItems: string[] }[];
}
export type IWidgetData = { [key: string]: IWidgetDataSchema };

export type LanguageType = { code: string; name: string };
