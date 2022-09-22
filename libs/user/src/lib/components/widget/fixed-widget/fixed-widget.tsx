import { WidgetTypeProps } from '../../../types';

export function FixedWidget({ widgetData, formatItem }: WidgetTypeProps) {
  return (
    <div
      className={`grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`}
    >
      {widgetData.widgetType === 'Image'
        ? widgetData.tiles.map((tile) => formatItem(tile))
        : widgetData.collectionItems.map((item) => formatItem(item))}
    </div>
  );
}

export default FixedWidget;
