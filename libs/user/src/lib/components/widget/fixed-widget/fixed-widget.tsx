import { WidgetTypeProps } from '../../../types';
import { filterTileData } from '../../../utils/helper';

export function FixedWidget({
  widgetData,
  formatItem,
  className,
}: WidgetTypeProps) {
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  return (
    <div className={className || gridClasses}>
      {widgetData.widgetType === 'Image'
        ? widgetData.tiles
            .filter(filterTileData)
            .map((tile) => formatItem(tile))
        : widgetData.collectionItems.map((item) => formatItem(item))}
    </div>
  );
}

export default FixedWidget;
