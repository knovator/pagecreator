import { PageProps } from '../../types';
import Widget from '../widget/widget';

export function Page({
  title,
  imageBaseUrl,
  pageData,
  formatItem,
  onClick,
  hideWidgetTitles,
}: PageProps) {
  if (!pageData) return null;
  return (
    <div className="kpc_page">
      {title && <h1 className="kpc_page-title">{title}</h1>}
      <div className="kpc_page-widgets">
        {pageData.widgets.map((widgetData, index) => (
          <Widget
            widgetData={widgetData}
            key={index}
            imageBaseUrl={imageBaseUrl}
            hideTitle={hideWidgetTitles === true}
            formatItem={
              formatItem &&
              ((itemData) => formatItem(widgetData.code, itemData))
            }
            onClick={
              onClick && ((itemData) => onClick(widgetData.code, itemData))
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
