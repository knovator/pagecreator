import { CollectionItemType, ItemData, WidgetProps } from '../../types';
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
  hideTitle,
  className,
  formatFooter,
  formatHeader,
}: WidgetProps) {
  const formatItems = (item: ItemData | CollectionItemType): JSX.Element => {
    if (typeof formatItem === 'function' && formatItem) return formatItem(item);
    else if (widgetData.itemsType === 'Image')
      return (
        <Banner
          key={item._id}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          imageUrl={`${imageBaseUrl || ''}${item.image?.uri}`}
          imageAltText={item._id}
          onClick={() => onClick && onClick(item)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          srcSets={buildSrcSets(imageBaseUrl, item.srcSets)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          title={item.title}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          subtitle={item.subtitle}
        />
      );
    else
      return (
        <CollectionItem
          key={item._id}
          onClick={() => onClick && onClick(item)}
          {...item}
        />
      );
  };
  if (!widgetData) return null;
  return (
    <div
      className="kpc_widget"
      style={{ backgroundColor: widgetData.backgroundColor }}
    >
      {hideTitle === true ? null : typeof formatHeader === 'function' ? (
        formatHeader(widgetData.widgetTitle, widgetData)
      ) : (
        <h2 className="kpc_widget-title">{widgetData.widgetTitle}</h2>
      )}
      <div className="kpc_widget-body">
        {widgetData.widgetType === 'Carousel' ? (
          <CarouselWidget
            settings={settings}
            widgetData={widgetData}
            formatItem={formatItems}
            className={className}
          />
        ) : (
          <FixedWidget
            widgetData={widgetData}
            formatItem={formatItems}
            className={className}
          />
        )}
      </div>
      {typeof formatFooter === 'function' ? formatFooter(widgetData) : null}
    </div>
  );
}

export default Widget;
