import { Settings } from 'react-slick';
import { TileData, WidgetData, ObjectType } from './';

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
  apiBaseUrl: string;
  formatItem?: (item: TileData) => JSX.Element;
  onClick?: (item: TileData) => void;
}
export interface WidgetTypeProps extends WidgetProps {
  formatTile: (item: TileData) => JSX.Element;
  settings?: Settings;
}
