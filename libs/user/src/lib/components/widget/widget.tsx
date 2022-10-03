import { CollectionItemType, TileData, WidgetProps } from '../../types';
import FixedWidget from './fixed-widget/fixed-widget';
import CarouselWidget from './carousel-widget/carousel-widget';
import Banner from '../common/Card/banner/banner';
import CollectionItem from '../common/collection-item/collection-item';

export function Widget({
  widgetData,
  imageBaseUrl,
  formatItem,
  onClick,
  settings,
  showTitle,
}: WidgetProps) {
  const formatTile = (tile: TileData | CollectionItemType): JSX.Element => {
    if (typeof formatItem === 'function' && formatItem) return formatItem(tile);
    else if (widgetData.widgetType === 'Image')
      return (
        <Banner
          key={tile._id}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          imageUrl={`${imageBaseUrl}${tile.img?.uri}`}
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
      {typeof showTitle === 'boolean' && !showTitle ? (
        <h2 className="kpc_widget-title">{widgetData.selectionTitle}</h2>
      ) : null}
      <div className="kpc_widget-body">
        {widgetData.selectionType === 'Carousel' ? (
          <CarouselWidget
            settings={settings}
            imageBaseUrl={imageBaseUrl}
            widgetData={widgetData}
            formatItem={formatTile}
          />
        ) : (
          <FixedWidget
            imageBaseUrl={imageBaseUrl}
            widgetData={widgetData}
            formatItem={formatTile}
          />
        )}
      </div>
    </div>
  );
}

export default Widget;
