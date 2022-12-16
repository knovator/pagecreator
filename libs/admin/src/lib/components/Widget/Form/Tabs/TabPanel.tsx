import React from 'react';
import { OptionType, TabPanelProps } from '../../../../types';
import CustomReactSelect from '../../../common/Input/ReactSelect';

const TabPanel = ({ options, selectedOptions, onChange }: TabPanelProps) => {
  return (
    <CustomReactSelect
      options={options}
      onChange={(value: OptionType | OptionType[] | null) => {
        if (value) {
          if (Array.isArray(value)) onChange(value);
          else onChange([value]);
        }
      }}
      selectedOptions={selectedOptions}
      isMulti={true}
      isSearchable={true}
      // onSearch={schema.onSearch}
      // isLoading={schema.isLoading}
      // placeholder={schema.placeholder}
      // wrapperClassName={schema.wrapperClassName}
      // formatOptionLabel={schema.formatOptionLabel}
    />
  );
};

export default TabPanel;
