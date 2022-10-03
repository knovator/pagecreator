import { Settings } from 'react-slick';
import {
  TileData,
  WidgetData,
  ObjectType,
  PageData,
  CollectionItemType,
} from './';

interface SlideProps {
  onClick?: (data?: ObjectType) => void;
}
export interface BannerProps extends SlideProps {
  imageUrl: string;
  imageAltText: string;
}
export interface CardProps {
  imageUrl: string;
  imageAltText: string;
  onClick?: (data?: ObjectType) => void;
}
export interface ProductCardProps extends CardProps {
  title: string;
  subTitle?: string;
  label?: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SimpleCardProps extends ProductCardProps {}
export interface HighlightCardProps extends ProductCardProps {
  highlightedText: string;
  dimmedText: string;
}
export interface UserCardProps extends CardProps {
  name: string;
}
export interface ReviewCardProps extends UserCardProps {
  stars: number;
  review: string;
}

export interface WidgetProps {
  widgetData: WidgetData;
  imageBaseUrl: string;
  showTitle?: boolean;
  formatItem?: (item: TileData | CollectionItemType) => JSX.Element;
  onClick?: (item: TileData | CollectionItemType) => void;
  settings?: Settings;
}
export interface WidgetTypeProps extends WidgetProps {
  formatItem: (item: CollectionItemType | TileData) => JSX.Element;
}

export interface PageProps {
  title?: string;
  imageBaseUrl: string;
  pageData: PageData;
  showWidgetTitles?: boolean;
  formatItem?: (
    CODE: string,
    item: TileData | CollectionItemType
  ) => JSX.Element;
  onClick?: (CODE: string, item: TileData | CollectionItemType) => JSX.Element;
}

export interface CollectionItemProps {
  name?: string;
  onClick?: () => void;
}