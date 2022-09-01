import { TileData, WidgetProps } from '../../types';
import FixedWidget from './fixed-widget/fixed-widget';
import CarouselWidget from './carousel-widget/carousel-widget';
import SimpleCard from '../common/Card/simple-card/simple-card';
import Banner from '../common/Card/banner/banner';

export function Widget({
  widgetData,
  apiBaseUrl,
  formatItem,
  onClick,
}: WidgetProps) {
  const formatTile = (tile: TileData): JSX.Element => {
    if (typeof formatItem === 'function' && formatItem) return formatItem(tile);
    else if (widgetData.widgetType === 'Image')
      return (
        <Banner
          imageUrl={`${apiBaseUrl}${tile.img?.uri}`}
          imageAltText={tile.altText}
        />
      );
    else
      return (
        <SimpleCard
          onClick={() => onClick && onClick(tile)}
          title={tile.title}
          imageUrl={`${apiBaseUrl}${tile.img?.uri}`}
          imageAltText={tile.altText}
          key={tile._id}
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
            formatItem={formatItem}
            formatTile={formatTile}
          />
        ) : (
          <FixedWidget
            apiBaseUrl={apiBaseUrl}
            widgetData={widgetData}
            formatItem={formatItem}
            formatTile={formatTile}
          />
        )}
      </div>
    </div>
  );
}

export default Widget;
