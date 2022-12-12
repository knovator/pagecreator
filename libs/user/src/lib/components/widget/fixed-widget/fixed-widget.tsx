import { ItemsTypeProps } from '../../../types';
import { filterTileData } from '../../../utils/helper';

export function FixedWidget({
  widgetData,
  formatItem,
  className,
}: ItemsTypeProps) {
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  return (
    <div className={className || gridClasses}>
      {widgetData.itemsType === 'Image'
        ? widgetData.tiles
            .filter(filterTileData)
            .map((tile) => formatItem(tile))
        : widgetData.collectionItems.map((item) => formatItem(item))}
    </div>
  );
}

export default FixedWidget;
