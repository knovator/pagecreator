import { CollectionItemType, TileData, WidgetProps } from '../../types';
import FixedWidget from './fixed-widget/fixed-widget';
import CarouselWidget from './carousel-widget/carousel-widget';
import Banner from '../common/Card/banner/banner';
import CollectionItem from '../common/collection-item/collection-item';
import { buildSrcSets } from '../../utils/helper';

export function Widget({
  widgetData,
  imageBaseUrl,
  formatItem,
  onClick,
  settings,
  showTitle,
  className,
}: WidgetProps) {
  const formatTile = (tile: TileData | CollectionItemType): JSX.Element => {
    if (typeof formatItem === 'function' && formatItem) return formatItem(tile);
    else if (widgetData.itemsType === 'Image')
      return (
        <Banner
          key={tile._id}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          imageUrl={`${imageBaseUrl || ''}${tile.image?.uri}`}
          imageAltText={tile._id}
          onClick={() => onClick && onClick(tile)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          srcSets={buildSrcSets(imageBaseUrl, tile.srcSets)}
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
        <h2 className="kpc_widget-title">{widgetData.widgetTitle}</h2>
      ) : null}
      <div className="kpc_widget-body">
        {widgetData.widgetType === 'Carousel' ? (
          <CarouselWidget
            settings={settings}
            widgetData={widgetData}
            formatItem={formatTile}
            className={className}
          />
        ) : (
          <FixedWidget
            widgetData={widgetData}
            formatItem={formatTile}
            className={className}
          />
        )}
      </div>
    </div>
  );
}

export default Widget;
