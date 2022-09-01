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

export interface WidgetData {
  _id: string;
  name: string;
  code: string;
  autoPlay: boolean;
  isActive: boolean;
  selectionTitle: string;
  webPerRow: number;
  mobilePerRow: number;
  tabletPerRow: number;
  widgetType: 'Image' | string;
  selectionType: 'FixedCard' | 'Carousel';
  webTiles: TileData[];
  mobileTiles: TileData[];
}
export interface TileData {
  _id: string;
  title: string;
  altText: string;
  link: string;
  tileType: 'Web' | 'Mobile';
  img: ImgData;
}
export interface ImgData {
  _id: string;
  uri: string;
}
