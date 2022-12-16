import React, { useState } from 'react';
import classNames from 'classnames';
import {
  TabList,
  Tabs as PkgTabs,
  Tab as PkgTab,
  TabPanel as PkgTabPanel,
} from 'react-tabs';
import { useFieldArray, Controller } from 'react-hook-form';
import { TabsProps } from '../../../../types';

import Plus from '../../../../icons/plus';
import Button from '../../../common/Button';
import TabPanel from './TabPanel';
import TabItem from './TabItem';

const Tabs = ({ options, control, register }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    fields: tabFields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({ name: 'tabs', control });

  const addTab = () => {
    appendField({
      name: 'Tab Name',
      collectionItems: [],
    });
  };

  return (
    <div className="p-3 border rounded">
      <PkgTabs
        selectedIndex={activeTab}
        className="py-2"
        onSelect={setActiveTab}
      >
        <TabList className="flex gap-x-4 gap-y-2.5 flex-wrap ">
          {tabFields?.map((field, index) => {
            return (
              <PkgTab
                key={field.id}
                className={classNames('khb_tabs-item', {
                  'khb_tabs-item-selected': activeTab === index,
                })}
              >
                <TabItem
                  key={field.id}
                  deleteTitle="Are you sure?"
                  register={register(`tabs.${index}.name`)}
                  onRemoveTab={() => {
                    removeField(index);
                    setActiveTab(index === 0 ? 0 : index - 1);
                  }}
                  showDelete={tabFields?.length > 1}
                />
              </PkgTab>
            );
          })}
          <Button className="khb_tabs-add" onClick={addTab}>
            <Plus />
          </Button>
        </TabList>
        <div className="pt-2">
          {tabFields?.map((field, index) => (
            <PkgTabPanel key={field.id}>
              <Controller
                control={control}
                name={`tabs.${index}.collectionItems`}
                render={({ field: { value, onChange } }) => (
                  <TabPanel
                    options={options}
                    onChange={onChange}
                    selectedOptions={value}
                  />
                )}
              />
            </PkgTabPanel>
          ))}
        </div>
      </PkgTabs>
    </div>
  );
};

export default Tabs;
