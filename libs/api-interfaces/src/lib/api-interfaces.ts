import {
  Model,
  FilterQuery,
  QueryOptions,
  HydratedDocument,
  Document,
  Mixed,
} from 'mongoose';

export interface IPageSchema extends Document {
  name: string;
  code: string;
  widgets: string[];
}
export interface IWidgetSchema extends Document {
  name: string;
  code: string;
  autoPlay: boolean;
  isActive: boolean;
  selectionTitle: string;
  webPerRow: number;
  mobilePerRow: number;
  tabletPerRow: number;
  widgetType: string;
  selectionType: string;
  collectionName: string;
  collectionItems: string[];
}
export interface ITileSchema extends Document {
  widgetId: Mixed;
  title: string;
  altText: string;
  link: string;
  sequence: number;
  tileType: string;
  img: any;
}

export type CollectionItem = {
  title: string;
  collectionName: string;
  filters?: { [key: string]: string | number | boolean };
  searchColumns: string[];
};

export interface IConfig {
  logger: any;
  catchAsync: (
    fn: any,
    modal?: string
  ) => (req: any, res: any, next: any) => void;
  collections: CollectionItem[];
}

export type EntityType = IWidgetSchema | ITileSchema | IPageSchema;
export type ReturnDocument = EntityType;
export interface IModel<T> extends Model<T> {
  paginate: (
    query: FilterQuery<T>,
    options?: QueryOptions
  ) => Promise<HydratedDocument<ReturnDocument>[]>;
}
export type TypesType = { value: string; label: string };
