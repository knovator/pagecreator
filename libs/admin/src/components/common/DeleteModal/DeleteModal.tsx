import React, { useEffect, useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { DeleteModalProps } from '../../../types';
import { TRANSLATION_PAIRS_COMMON } from '../../../constants/common';

const DeleteModal = ({
  formState,
  onClose,
  itemData,
  onConfirmDelete,
  permanentlyDelete = TRANSLATION_PAIRS_COMMON.permanentlyDelete,
  lossOfData = TRANSLATION_PAIRS_COMMON.lossOfData,
  pleaseType = TRANSLATION_PAIRS_COMMON.pleaseType,
  toProceedOrCancel = TRANSLATION_PAIRS_COMMON.toProceedOrCancel,
  confirm = TRANSLATION_PAIRS_COMMON.confirm,
}: DeleteModalProps) => {
  const [userInput, setUserInput] = useState<string>('');
  useEffect(() => {
    setUserInput('');
  }, [formState]);
  return itemData ? (
    <Modal
      open={formState === 'DELETE' && itemData ? true : false}
      onClose={onClose}
      title="Confirmation Required"
    >
      <div className="khb_delete-header">
        <p>
          {permanentlyDelete} <b>{itemData['name']}</b>
        </p>
      </div>
      <div className="khb_delete-content">
        <p>{lossOfData}</p>
        <p className="khb_delete-note">
          {pleaseType}{' '}
          <b className="text-black font-bold">{itemData['name']}</b>{' '}
          {toProceedOrCancel}
        </p>
      </div>
      <div className="khb_delete-actions">
        <Input
          placeholder="Type Here"
          className="khb_delete-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="khb_delete-buttons">
          <Button
            disabled={userInput !== itemData?.['name']}
            onClick={onConfirmDelete}
          >
            {confirm}
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default DeleteModal;
