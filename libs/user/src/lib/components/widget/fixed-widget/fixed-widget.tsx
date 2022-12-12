import { ItemsTypeProps } from '../../../types';
import { filterItemData } from '../../../utils/helper';

export function FixedWidget({
  widgetData,
  formatItem,
  className,
}: ItemsTypeProps) {
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  return (
    <div className={className || gridClasses}>
      {widgetData.itemsType === 'Image'
        ? widgetData.items
            .filter(filterItemData)
            .map((item) => formatItem(item))
        : widgetData.collectionItems.map((item) => formatItem(item))}
    </div>
  );
}

export default FixedWidget;
