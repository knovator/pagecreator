import React, { useState } from 'react';
import classNames from 'classnames';
import {
  TabList,
  Tabs as PkgTabs,
  Tab as PkgTab,
  TabPanel as PkgTabPanel,
} from 'react-tabs';
import { useFieldArray, Controller } from 'react-hook-form';
import { OptionType, TabsProps } from '../../../../types';

import Plus from '../../../../icons/plus';
import Button from '../../../common/Button';
import TabItem from './TabItem';
import CustomReactSelect from '../../../common/Input/ReactSelect';
import DNDItemsList from '../../../common/DNDItemsList';

const Tabs = ({
  options,
  control,
  register,
  listCode,
  formatItem,
  deleteTitle,
  loadOptions,
  customStyles,
  noButtonText,
  yesButtonText,
  isItemsLoading,
  itemsPlaceholder,
  formatOptionLabel,
  tabCollectionItems,
  onCollectionItemsIndexChange,
}: TabsProps) => {
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
    setActiveTab(tabFields.length);
  };

  return (
    <div className="khb_tabs-container">
      <PkgTabs
        selectedIndex={activeTab}
        onSelect={setActiveTab}
        className="khb-tabs"
      >
        <TabList className="khb_tabs-list">
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
                  deleteTitle={deleteTitle}
                  register={register(`tabs.${index}.name`)}
                  onRemoveTab={() => {
                    removeField(index);
                    setActiveTab(index === 0 ? 0 : index - 1);
                  }}
                  noButtonText={noButtonText}
                  yesButtonText={yesButtonText}
                  showDelete={tabFields?.length > 1}
                />
              </PkgTab>
            );
          })}
          <Button className="khb_tabs-add" onClick={addTab}>
            <Plus />
          </Button>
        </TabList>
        <div className="khb_tabs-body">
          {tabFields?.map((field, index) => (
            <PkgTabPanel key={field.id}>
              <Controller
                control={control}
                name={`tabs.${index}.collectionItems`}
                render={({ field: { value, onChange } }) => (
                  <CustomReactSelect
                    options={options}
                    onChange={(value: OptionType | OptionType[] | null) => {
                      if (value) {
                        if (Array.isArray(value)) onChange(value);
                        else onChange([value]);
                      }
                    }}
                    key={listCode}
                    selectedOptions={value}
                    isMulti={true}
                    isSearchable={true}
                    loadOptions={loadOptions}
                    isLoading={isItemsLoading}
                    placeholder={itemsPlaceholder}
                    listCode={listCode}
                    customStyles={customStyles}
                    // wrapperClassName={schema.wrapperClassName}
                    formatOptionLabel={formatOptionLabel}
                  />
                )}
              />
            </PkgTabPanel>
          ))}
        </div>
      </PkgTabs>
      <DNDItemsList
        items={tabCollectionItems[activeTab]}
        onDragEnd={(result) => onCollectionItemsIndexChange(activeTab, result)}
        formatItem={formatItem}
        listCode={listCode}
      />
    </div>
  );
};

export default Tabs;
