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
  confirmationRequired,
  permanentlyDelete,
  lossOfData,
  pleaseType,
  toProceedOrCancel,
  confirm,
  typeHerePlaceholder,
}: DeleteModalProps) => {
  const [userInput, setUserInput] = useState<string>('');
  useEffect(() => {
    setUserInput('');
  }, [formState]);
  return itemData ? (
    <Modal
      open={formState === 'DELETE' && itemData ? true : false}
      onClose={onClose}
      title={
        confirmationRequired || TRANSLATION_PAIRS_COMMON.confirmationRequired
      }
    >
      <div className="khb_delete-header">
        <p>
          {permanentlyDelete || TRANSLATION_PAIRS_COMMON.permanentlyDelete}{' '}
          <b>{itemData['name']}</b>
        </p>
      </div>
      <div className="khb_delete-content">
        <p>{lossOfData || TRANSLATION_PAIRS_COMMON.lossOfData}</p>
        <p className="khb_delete-note">
          {pleaseType || TRANSLATION_PAIRS_COMMON.pleaseType}{' '}
          <b className="text-black font-bold">{itemData['name']}</b>{' '}
          {toProceedOrCancel || TRANSLATION_PAIRS_COMMON.toProceedOrCancel}
        </p>
      </div>
      <div className="khb_delete-actions">
        <Input
          placeholder={
            typeHerePlaceholder || TRANSLATION_PAIRS_COMMON.typeHerePlaceholder
          }
          wrapperClassName="w-full"
          className="khb_delete-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="khb_delete-buttons">
          <Button
            disabled={
              userInput.toString().trim() !== itemData?.['name']?.trim()
            }
            onClick={onConfirmDelete}
          >
            {confirm || TRANSLATION_PAIRS_COMMON.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default DeleteModal;
