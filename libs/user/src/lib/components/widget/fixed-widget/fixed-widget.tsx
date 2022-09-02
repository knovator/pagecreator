import { WidgetTypeProps } from '../../../types';

export function FixedWidget({
  widgetData,
  formatTile,
  formatItem,
}: WidgetTypeProps) {
  return (
    <div
      className={`grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`}
    >
      {widgetData.widgetType === 'Image'
        ? widgetData.tiles.map((tile) => formatTile(tile))
        : widgetData.collectionItems.map((item) => formatItem(item))}
      {widgetData.tiles.map((tile) => formatTile(tile))}
    </div>
  );
}

export default FixedWidget;
