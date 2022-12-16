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
      containerClassName="relative bg-white px-4 py-2.5 z-20 border border-gray rounded shadow-lg"
      isOpen={isPopoverOpen}
      padding={10}
      reposition={false}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={() => (
        <div className="grid grid-cols-1 gap-1.5">
          <div className="font-bold">{title}</div>
          <div className="flex justify-center">
            <Button
              type="secondary"
              onClick={() => setIsPopoverOpen(false)}
              className="hover:border-primary mr-2"
            >
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
