import { SwiperProps } from 'swiper/react';
import {
  ItemData,
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
  srcSets?: string;
  title: string;
  subtitle?: string;
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

type formatTabTitleFunction = (
  title: string | Record<string, string>,
  collectionData: any[],
  isActive: boolean
) => JSX.Element;

export interface WidgetProps {
  widgetData: WidgetData;
  imageBaseUrl?: string;
  hideTitle?: boolean;
  formatItem?: (item: ItemData | CollectionItemType) => JSX.Element;
  onClick?: (item: ItemData | CollectionItemType) => void;
  settings?: SwiperProps;
  className?: string;
  formatTabTitle?: formatTabTitleFunction;
  formatHeader?: (title: string, data: WidgetData) => string | JSX.Element;
  formatFooter?: (data: WidgetData) => string | JSX.Element;
  itemsContainer?: (children: JSX.Element) => JSX.Element;
}
export interface ItemsTypeProps extends WidgetProps {
  formatItem: (item: CollectionItemType | ItemData) => JSX.Element;
  formatTabTitle: formatTabTitleFunction;
  itemsContainer?: (children: any) => JSX.Element;
}

export interface PageProps {
  title?: string;
  imageBaseUrl?: string;
  pageData: PageData;
  hideWidgetTitles?: boolean;
  formatWidget?: (item: WidgetData, index: number) => JSX.Element;
  formatItem?: (
    CODE: string,
    item: ItemData | CollectionItemType
  ) => JSX.Element;
  onClick?: (CODE: string, item: ItemData | CollectionItemType) => JSX.Element;
}

export interface CollectionItemProps {
  name?: string;
  onClick?: () => void;
}
