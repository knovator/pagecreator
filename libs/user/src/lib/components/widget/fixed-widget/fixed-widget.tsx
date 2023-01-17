import React, { Fragment } from 'react';
import { ItemsTypeProps } from '../../../types';
import { filterItemData } from '../../../utils/helper';

export function FixedWidget({
  widgetData,
  formatItem,
  className,
  itemsContainer,
}: ItemsTypeProps) {
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  if (typeof itemsContainer === 'function')
    return itemsContainer(
      widgetData.itemsType === 'Image'
        ? widgetData.items
            .filter(filterItemData)
            .map((item, index) => (
              <Fragment key={index}>{formatItem(item)}</Fragment>
            ))
        : widgetData.collectionItems.map((item, index) => (
            <Fragment key={index}>{formatItem(item)}</Fragment>
          ))
    );
  return (
    <div className={className || gridClasses}>
      {widgetData.itemsType === 'Image'
        ? widgetData.items
            .filter(filterItemData)
            .map((item, index) => (
              <Fragment key={index}>{formatItem(item)}</Fragment>
            ))
        : widgetData.collectionItems.map((item, index) => (
            <Fragment key={index}>{formatItem(item)}</Fragment>
          ))}
    </div>
  );
}

export default FixedWidget;
