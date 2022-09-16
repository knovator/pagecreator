import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { FormProps, SchemaType } from '../../../types';

import Form from '../../common/Form';
import DNDItemsList from '../../common/DNDItemsList';

import { usePageState } from '../../../context/PageContext';
import { capitalizeFirstLetter, changeToCode } from '../../../helper/utils';

const PageForm = ({ formState, formRef }: FormProps) => {
  const {
    t,
    data,
    onPageFormSubmit,
    selectedWidgets,
    setSelectedWidgets,
    widgets,
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
      label: t('page.widgets'),
      accessor: 'widgets',
      type: 'ReactSelect',
      options: widgets,
      selectedOptions: selectedWidgets,
      isMulti: true,
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
