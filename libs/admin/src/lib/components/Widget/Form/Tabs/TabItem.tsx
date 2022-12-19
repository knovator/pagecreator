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
  noButtonText,
  yesButtonText,
}: TabItemProps) => {
  return (
    <>
      <input
        type="text"
        className="khb_tabs-input"
        autoFocus
        disabled={isDisabled}
        {...(register || {})}
      />
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
