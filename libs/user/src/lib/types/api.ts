import { ObjectType } from '.';

export type API_INPUT_TYPE = { prefix: string; id?: string };

export interface BaseAPIProps {
  config?: ObjectType;
  baseUrl: string;
  token: string | (() => Promise<string>);
  data?: ObjectType;
  url: string;
  method: string;
  onError?: (error: Error) => void;
}

export type ACTION_TYPES = 'GET_WIDGET_DATA' | 'GET_PAGE_DATA';

export type API_TYPE = {
  url: string;
  method: string;
};

export type Routes_Input = {
  [K in ACTION_TYPES]?: (data: API_INPUT_TYPE) => API_TYPE;
};

export interface PageData {
  _id: string;
  name: string;
  code: string;
  widgets: WidgetData[];
}
export interface WidgetData {
  _id: string;
  name: string;
  code: string;
  autoPlay: boolean;
  isActive: boolean;
  widgetTitle: string;
  webPerRow: number;
  mobilePerRow: number;
  tabletPerRow: number;
  itemsType: 'Image' | string;
  widgetType: 'FixedCard' | 'Carousel';
  items: ItemData[];
  collectionItems: CollectionItemType[];
  backgroundColor: string;
}
export interface ItemData {
  _id: string;
  title: string;
  subtitle?: string;
  altText: string;
  link: string;
  itemType: 'Web' | 'Mobile';
  img: ImgData;
  srcSets?: string;
  srcset?: SrcSetItem[];
}
export interface ImgData {
  _id: string;
  uri: string;
}
export interface CollectionItemType {
  _id: string;
  name?: string;
}

export interface SrcSetItem {
  screenSize: number;
  width: number;
  height: number;
}