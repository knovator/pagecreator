import { PageProps } from '../../types';
import Widget from '../widget/widget';

export function Page({
  title,
  apiBaseUrl,
  pageData,
  formatItem,
  onClick,
}: PageProps) {
  if (!pageData) return null;
  return (
    <div className="kpc_page">
      <h1 className="kpc_page-title">{title}</h1>
      <div className="kpc_page-widgets">
        {pageData.widgets.map((widgetData, index) => (
          <Widget
            widgetData={widgetData}
            key={index}
            apiBaseUrl={apiBaseUrl}
            formatItem={
              formatItem &&
              ((tileData) => formatItem(widgetData.code, tileData))
            }
            onClick={
              onClick && ((tileData) => onClick(widgetData.code, tileData))
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
