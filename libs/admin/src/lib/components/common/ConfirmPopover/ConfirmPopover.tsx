/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { ConfirmPopoverProps } from '../../../types';
import Button from '../Button';

const ConfirmPopOver = ({
  children,
  onConfirm,
  title,
  confirmText = 'Yes',
  cancelText = 'No',
}: ConfirmPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onConfirmClick = () => {
    setIsPopoverOpen(false);
    onConfirm();
  };

  return (
    <Popover
      containerClassName="khb_confirm-popover"
      isOpen={isPopoverOpen}
      padding={10}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={() => (
        <div className="khb_confirm-popover-content">
          <div className="khb_confirm-popover-title">{title}</div>
          <div className="khb_confirm-popover-footer">
            <Button type="secondary" onClick={() => setIsPopoverOpen(false)}>
              {cancelText}
            </Button>
            <Button type="primary" onClick={onConfirmClick}>
              {confirmText}
            </Button>
          </div>
        </div>
      )}
    >
      <div onClick={() => setIsPopoverOpen(true)}>{children}</div>
    </Popover>
  );
};
export default ConfirmPopOver;
