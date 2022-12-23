import React, { useState, Fragment } from 'react';
import { ItemsTypeProps } from '../../../types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export function TabWidget({
  widgetData,
  formatItem,
  className,
  formatTabTitle,
  itemsContainer,
}: ItemsTypeProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  return (
    <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
      <TabList>
        {widgetData.tabs.map((tab, index) => (
          <Tab key={index}>
            {formatTabTitle(tab.name, tab.collectionItems, activeTab === index)}
          </Tab>
        ))}
      </TabList>
      {widgetData.tabs.map((tab, index) => (
        <TabPanel key={index}>
          {typeof itemsContainer === 'function' ? (
            itemsContainer(
              <Fragment>
                {tab.collectionItems.map((item, index) => (
                  <Fragment key={index}>{formatItem(item)}</Fragment>
                ))}
              </Fragment>
            )
          ) : (
            <div className={className || gridClasses}>
              {tab.collectionItems.map((item, index) => (
                <Fragment key={index}>{formatItem(item)}</Fragment>
              ))}
            </div>
          )}
        </TabPanel>
      ))}
    </Tabs>
  );
}

export default TabWidget;
