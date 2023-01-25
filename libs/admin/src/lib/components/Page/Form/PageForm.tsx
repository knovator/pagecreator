import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { FormProps, SchemaType } from '../../../types';

import Form from '../../common/Form';
import DNDItemsList from '../../common/DNDItemsList';

import { usePageState } from '../../../context/PageContext';
import {
  capitalizeFirstLetter,
  changeToCode,
  changeToSlug,
} from '../../../helper/utils';
import { CONSTANTS } from '../../../constants/common';

const PageForm = ({ formRef }: FormProps) => {
  const {
    t,
    data,
    formState,
    onPageFormSubmit,
    selectedWidgets,
    setSelectedWidgets,
    widgets,
    getWidgets,
    onChangeWidgetSequence,
    canAdd,
    canUpdate,
  } = usePageState();

  // Form Utility Functions
  function handleCapitalize(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = capitalizeFirstLetter(event.target.value);
    return event;
  }
  function handleCode(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = changeToCode(event.target.value);
    return event;
  }
  function handleSlug(event: React.ChangeEvent<HTMLInputElement>) {
    let slugValue = changeToSlug(event.target.value);
    if (!slugValue || !CONSTANTS.SLUG_REGEX.test(slugValue)) {
      slugValue = '';
    } else {
      slugValue = slugValue.replace(CONSTANTS.SLUG_REPLACE_REGEX, '');
    }
    event.target.value = slugValue;
    return event;
  }
  function loadOptions(value?: string, callback?: (data: any) => void): any {
    getWidgets((widgetsData: any) => {
      if (callback) callback(widgetsData);
      if (formState === 'UPDATE' && data)
        setSelectedWidgets(
          data.widgets
            .map((widgetId: string) =>
              widgetsData.find((widget: any) => widget['value'] === widgetId)
            )
            .filter((widget: any) => widget)
        );
    });
  }
  // Widget Form Functions
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (destination) onChangeWidgetSequence(source.index, destination.index);
  };

  // Schemas
  const pageFormSchema: SchemaType[] = [
    {
      label: `${t('page.name')}`,
      required: true,
      accessor: 'name',
      type: 'text',
      placeholder: t('page.namePlaceholder'),
      onInput: handleCapitalize,
      validations: {
        required: t('page.nameRequired'),
      },
    },
    {
      label: `${t('page.code')}`,
      accessor: 'code',
      required: true,
      type: 'text',
      onInput: handleCode,
      editable: false,
      placeholder: t('page.codePlaceholder'),
      validations: {
        required: t('page.codeRequired'),
      },
    },
    {
      label: `${t('page.slug')}`,
      accessor: 'slug',
      required: true,
      type: 'text',
      onInput: handleSlug,
      editable: false,
      placeholder: t('page.slugPlaceholder'),
      validations: {
        required: t('page.slugRequired'),
      },
    },
    {
      label: t('page.widgets'),
      accessor: 'widgets',
      type: 'ReactSelect',
      options: widgets,
      selectedOptions: selectedWidgets,
      isMulti: true,
      loadOptions: loadOptions,
      onChange: (widgets) => setSelectedWidgets(widgets),
    },
  ];

  if (!canAdd && !canUpdate) return null;
  return (
    <div className="khb_form">
      <Form
        schema={pageFormSchema}
        onSubmit={onPageFormSubmit}
        ref={formRef}
        data={data}
        isUpdating={formState === 'UPDATE'}
        updates={{
          widgets: selectedWidgets.map(
            (widget: { value: string }) => widget.value
          ),
        }}
      />

      <DNDItemsList onDragEnd={onDragEnd} items={selectedWidgets} />
    </div>
  );
};

export default PageForm;
