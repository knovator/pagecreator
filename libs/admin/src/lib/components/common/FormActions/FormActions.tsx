import React from 'react';
import Button from '../Button';

interface FormActionsProps {
  loading?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryButtonClick?: (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onSecondaryButtonClick?: () => void;
}

const FormActions = ({
  loading = false,
  primaryLabel = 'Submit',
  secondaryLabel = 'Cancel',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}: FormActionsProps) => {
  return (
    <>
      <Button
        type="secondary"
        disabled={loading}
        onClick={onSecondaryButtonClick}
      >
        {secondaryLabel}
      </Button>
      <Button onClick={onPrimaryButtonClick} loading={loading}>
        {primaryLabel}
      </Button>
    </>
  );
};

export default FormActions;
