import React from 'react';
import FormActions from '../../common/FormActions';
import { FormActionWrapperProps } from '../../../types';
import { CALLBACK_CODES } from '../../../constants/common';
import { usePageState } from '../../../context/PageContext';
import { useProviderState } from '../../../context/ProviderContext';

const PageFormActions = ({ formRef }: FormActionWrapperProps) => {
  const { onError } = useProviderState();
  const { closeForm, loading, canAdd, canUpdate, t } = usePageState();
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
        `formRef is empty, make sure it's passed as 'ref' prop to the form!`
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
      primaryLabel={t('saveButtonText')}
      onPrimaryButtonClick={onSubmitClick}
      onSecondaryButtonClick={closeForm}
      secondaryLabel={t('cancelButtonText')}
    />
  );
};

export default PageFormActions;
