import React from 'react';
import Trash from '../../../../icons/trash';
import { TabItemProps } from '../../../../types';
import ConfirmPopover from '../../../common/ConfirmPopover';

const TabItem = ({
  showDelete,
  isDisabled,
  deleteTitle,
  onRemoveTab,
  register,
  error,
  noButtonText,
  yesButtonText,
}: TabItemProps) => {
  return (
    <>
      <input
        type="text"
        className="khb_tabs-input"
        autoFocus
        style={{ display: 'block' }}
        disabled={isDisabled}
        {...(register || {})}
      />
      {error && <p className="khb_input-error ">{error}</p>}
      {showDelete ? (
        <ConfirmPopover
          onConfirm={onRemoveTab}
          title={deleteTitle}
          confirmText={yesButtonText}
          cancelText={noButtonText}
        >
          <Trash className="khb_tabs-remove" />
        </ConfirmPopover>
      ) : (
        ''
      )}
    </>
  );
};

export default TabItem;
