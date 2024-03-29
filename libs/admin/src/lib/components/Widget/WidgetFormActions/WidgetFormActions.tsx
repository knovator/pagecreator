import React from 'react';
import FormActions from '../../common/FormActions';
import { FormActionWrapperProps } from '../../../types';
import { CALLBACK_CODES } from '../../../constants/common';
import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';

const WidgetFormActions = ({ formRef }: FormActionWrapperProps) => {
  const { onError } = useProviderState();
  const { closeForm, loading, canAdd, canUpdate, t, formState } =
    useWidgetState();
  const onSubmitClick = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!formRef) {
      return onError(
        CALLBACK_CODES.INTERNAL,
        'error',
        `formRef is required to submit the form!`
      );
    } else if (!formRef.current) {
      return onError(
        CALLBACK_CODES.INTERNAL,
        'error',
        `formRef is empty, make sure it's passed as 'formRef' prop to the form!`
      );
    }
    // formRef is provided
    e?.preventDefault();
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };

  if (!canAdd && !canUpdate) return null;
  return (
    <FormActions
      loading={loading}
      primaryLabel={
        formState === 'ADD'
          ? t('createButtonText') || t('common:createButtonText')
          : t('updateButtonText') || t('common:updateButtonText')
      }
      onPrimaryButtonClick={onSubmitClick}
      onSecondaryButtonClick={closeForm}
      secondaryLabel={t('cancelButtonText') || t('common:cancelButtonText')}
    />
  );
};

export default WidgetFormActions;
