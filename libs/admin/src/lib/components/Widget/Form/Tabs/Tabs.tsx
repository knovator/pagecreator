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
  errors,
  activeTab,
  setActiveTab,
  options,
  control,
  listCode,
  setValue,
  getValues,
  languages,
  formatItem,
  deleteTitle,
  clearErrors,
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
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    languages?.[0]?.code
  );
  const {
    fields: tabFields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({ name: 'tabs', control });

  const addTab = () => {
    appendField({
      ...(selectedLanguage
        ? {
            names: languages?.reduce((acc, lng) => {
              acc[lng.code] = '';
              return acc;
            }, {} as any),
          }
        : {
            name: '',
          }),
      collectionItems: [],
    });
    setActiveTab(tabFields.length);
  };
  const onTabnameChange = (index: number, value: string) => {
    if (selectedLanguage) {
      clearErrors(`tabs.${index}.names.${selectedLanguage}`);
      setValue(`tabs.${index}.names.${selectedLanguage}`, value);
    } else {
      clearErrors(`tabs.${index}.name`);
      setValue(`tabs.${index}.name`, value);
    }
  };

  return (
    <div className="khb_tabs-container">
      <PkgTabs
        selectedIndex={activeTab}
        onSelect={setActiveTab}
        className="khb-tabs"
      >
        <TabList className="khb_tabs-list">
          {Array.isArray(languages) && languages.length > 0 && (
            <div className="khb_input-wrapper">
              <select
                title="Change Language"
                value={selectedLanguage}
                className="khb_input khb_input-sm h-full"
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map((lng) => (
                  <option value={lng.code} key={lng.code}>
                    {lng.name}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                  register={{
                    value: getValues(`tabs.${index}.names.${selectedLanguage}`),
                    onChange: (e: any) =>
                      onTabnameChange(index, e.target.value || ''),
                  }}
                  onRemoveTab={() => {
                    removeField(index);
                    setActiveTab(index === 0 ? 0 : index - 1);
                  }}
                  error={
                    selectedLanguage
                      ? errors?.['tabs']?.[index]?.names
                        ? Object.keys(errors?.['tabs']?.[index]?.names)
                            .map(
                              (key) =>
                                errors?.['tabs']?.[index]?.names?.[key]?.message
                            )
                            .join(', ')
                        : ''
                      : errors?.['tabs']?.[index]?.name?.message
                  }
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
                    options={options || []}
                    onChange={(value: OptionType | OptionType[] | null) => {
                      if (value) {
                        if (Array.isArray(value)) onChange(value);
                        else onChange([value]);
                      }
                    }}
                    selectKey={`tabs.${index}.collectionItems-${JSON.stringify(
                      Array.isArray(value) && value.length > 0
                        ? value[0] || ''
                        : listCode
                    )}`}
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
