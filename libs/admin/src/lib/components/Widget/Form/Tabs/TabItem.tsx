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
        <ConfirmPopover onConfirm={onRemoveTab} title={deleteTitle}>
          <Trash className="khb_tabs-remove" />
        </ConfirmPopover>
      ) : (
        ''
      )}
    </>
  );
};

export default TabItem;
