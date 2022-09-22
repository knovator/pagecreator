import { CollectionItemType, TileData, WidgetProps } from '../../types';
import FixedWidget from './fixed-widget/fixed-widget';
import CarouselWidget from './carousel-widget/carousel-widget';
import Banner from '../common/Card/banner/banner';
import CollectionItem from '../common/collection-item/collection-item';

export function Widget({
  widgetData,
  apiBaseUrl,
  formatItem,
  onClick,
}: WidgetProps) {
  const formatTile = (tile: TileData | CollectionItemType): JSX.Element => {
    if (typeof formatItem === 'function' && formatItem) return formatItem(tile);
    else if (widgetData.widgetType === 'Image')
      return (
        <Banner
          key={tile._id}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          imageUrl={`${apiBaseUrl}${tile.img?.uri}`}
          imageAltText={tile._id}
          onClick={() => onClick && onClick(tile)}
        />
      );
    else
      return (
        <CollectionItem
          key={tile._id}
          onClick={() => onClick && onClick(tile)}
          {...tile}
        />
      );
  };
  if (!widgetData) return null;
  return (
    <div className="kpc_widget">
      <h2 className="kpc_widget-title">{widgetData.selectionTitle}</h2>
      <div className="kpc_widget-body">
        {widgetData.selectionType === 'Carousel' ? (
          <CarouselWidget
            apiBaseUrl={apiBaseUrl}
            widgetData={widgetData}
            formatItem={formatTile}
          />
        ) : (
          <FixedWidget
            apiBaseUrl={apiBaseUrl}
            widgetData={widgetData}
            formatItem={formatTile}
          />
        )}
      </div>
    </div>
  );
}

export default Widget;
