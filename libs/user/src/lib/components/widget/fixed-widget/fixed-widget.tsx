import { WidgetTypeProps } from '../../../types';

export function FixedWidget({
  apiBaseUrl,
  widgetData,
  onClick,
  formatTile,
}: WidgetTypeProps) {
  if (widgetData.widgetType === 'Image')
    return (
      <div
        className={`grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`}
      >
        {widgetData.webTiles.map((tile) => formatTile(tile))}
      </div>
    );
  else return null;
}

export default FixedWidget;
