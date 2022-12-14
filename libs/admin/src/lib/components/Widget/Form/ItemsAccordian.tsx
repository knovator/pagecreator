import React, { useEffect, useRef, useState } from 'react';
import Accordian from '../../common/Accordian';
import Button from '../../common/Button';
import Form from '../../common/Form';
import {
  CombineObjectType,
  FormActionTypes,
  ItemsAccordianProps,
} from '../../../types';

const ItemsAccordian = ({
  schema,
  onDataSubmit,
  show,
  title,
  id,
  itemsData,
  collapseId,
  toggleShow,
  itemType,
  widgetId,
  onDelete,
  addText = 'Add',
  saveText = 'Save',
  cancelText = 'Cancel',
  deleteText = 'Delete',
  editText = 'Edit',
}: ItemsAccordianProps) => {
  const [data, setData] = useState<CombineObjectType[]>([]);
  const formRefs = useRef<(HTMLFormElement | null)[]>([]);
  const [itemsShow, setItemsShow] = useState<boolean[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number>();

  useEffect(() => {
    if (Array.isArray(itemsData)) {
      setData(itemsData);
      formRefs.current = itemsData.map(() => null);
      setItemsShow(itemsData.map(() => false));
    }
  }, [itemsData]);

  const onItemFormSubmitClick = (index: number) => {
    formRefs.current[index]?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };
  const onItemFormSubmit = (index: number, formData: CombineObjectType) => {
    const state: FormActionTypes =
      index === editingItemIndex && data[index] ? 'UPDATE' : 'ADD';
    const finalData: any = { ...formData, widgetId, itemType, sequence: index };
    if (finalData['img'] && finalData['img']['_id']) {
      const id = finalData['img']['_id'];
      finalData['img'] = id;
    }
    onDataSubmit(
      state,
      finalData,
      state === 'UPDATE' ? (data[index]?.['_id'] as string) : undefined
    );
    setEditingItemIndex(undefined);
  };
  const onItemsToggleClick = (index: number, status?: boolean) => {
    const newItemsShow: boolean[] = [...itemsShow];
    const newStatus =
      typeof status === 'undefined' ? !newItemsShow[index] : status;
    newItemsShow.fill(false);
    newItemsShow[index] = newStatus;
    setItemsShow(newItemsShow);
  };
  const onItemRemoveClick = (index: number) => {
    const newItemsShow: boolean[] = [...itemsShow];
    newItemsShow.splice(index, 1);
    setItemsShow(newItemsShow);
    formRefs.current.splice(index, 1);
  };
  const onItemAddClick = () => {
    const newItemsShow: boolean[] = [...itemsShow];
    newItemsShow.push(false);
    setItemsShow(newItemsShow);
    formRefs.current.push(null);
    onItemsToggleClick(newItemsShow.length - 1);
  };
  const onItemEditClick = (index: number) => {
    setEditingItemIndex(index);
  };
  const onItemCancelClick = (index: number) => {
    if (!data[index]) {
      onItemRemoveClick(index);
    } else {
      setEditingItemIndex(undefined);
    }
    onItemsToggleClick(index, false);
  };
  const onDeleteClick = (index: number) => {
    onDelete(data[index]?.['_id'] as string);
    onItemRemoveClick(index);
  };

  return (
    <Accordian
      open={show}
      onToggle={() => toggleShow(!show)}
      title={title}
      collapseId={collapseId}
      id={id}
      footerContent={
        <Button size="sm" onClick={onItemAddClick} disabled={!widgetId}>
          {addText}
        </Button>
      }
    >
      <div className="khb_item-items">
        {itemsShow.map((status, index) => (
          <Accordian
            key={index}
            open={status}
            onToggle={() => onItemsToggleClick(index)}
            title={`Item ${index + 1}`}
            collapseId={`${id}-item-content-${index}`}
            id={`${id}-item-${index}`}
            footerContent={
              editingItemIndex === index || !data[index] ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => onItemFormSubmitClick(index)}
                  >
                    {saveText}
                  </Button>
                  <Button
                    type="secondary"
                    size="sm"
                    onClick={() => onItemCancelClick(index)}
                  >
                    {cancelText}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => onItemEditClick(index)}>
                    {editText}
                  </Button>
                  <Button
                    type="danger"
                    size="sm"
                    onClick={() => onDeleteClick(index)}
                  >
                    {deleteText}
                  </Button>
                </>
              )
            }
          >
            <Form
              schema={schema}
              data={data[index]}
              onSubmit={(data) => onItemFormSubmit(index, data)}
              ref={(el) => (formRefs.current[index] = el)}
              enable={editingItemIndex === index || !data[index]}
              isUpdating={editingItemIndex === index}
            />
          </Accordian>
        ))}
      </div>
    </Accordian>
  );
};

export default ItemsAccordian;
