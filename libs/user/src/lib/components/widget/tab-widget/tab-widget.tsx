import { useState } from 'react';
import { ItemsTypeProps } from '../../../types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export function TabWidget({
  widgetData,
  formatItem,
  className,
  formatTabTitle,
}: ItemsTypeProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const gridClasses = `grid grid-cols-${widgetData.mobilePerRow} md:grid-cols-${widgetData.tabletPerRow} lg:grid-cols-${widgetData.webPerRow}`;
  return (
    <div>
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <TabList>
          {widgetData.tabs.map((tab, index) => (
            <Tab key={index}>
              {formatTabTitle(
                tab.name,
                tab.collectionItems,
                activeTab === index
              )}
            </Tab>
          ))}
        </TabList>
        {widgetData.tabs.map((tab, index) => (
          <TabPanel key={index}>
            <div className={className || gridClasses}>
              {tab.collectionItems.map((item) => formatItem(item))}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

export default TabWidget;
