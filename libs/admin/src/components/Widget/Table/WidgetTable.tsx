import React, { useCallback } from 'react';
import Table from '../../common/Table';
import ToggleWidget from '../../common/Toggle';
import { useWidgetState } from '../../../context/WidgetContext';
import {
  CombineObjectType,
  ObjectType,
  ValuesType,
} from 'libs/admin/src/types';

const WidgetTable = () => {
  const {
    list,
    canList,
    onChangeFormState,
    onPartialUpdateWidget,
    loading,
    loader,
    t,
  } = useWidgetState();
  const updateClosure = useCallback(
    (item: ObjectType, key: string, value: ValuesType) => {
      onPartialUpdateWidget({ [key]: value }, item['_id']);
    },
    [onPartialUpdateWidget]
  );
  const onUpdateClick = (item: CombineObjectType) =>
    onChangeFormState('UPDATE', item);
  const onDeleteClick = (item: CombineObjectType) =>
    onChangeFormState('DELETE', item);

  if (!canList) return null;
  return (
    <Table
      data={list}
      loader={loader}
      loading={loading}
      dataKeys={[
        { label: t('widget.tableName'), dataKey: 'name', highlight: true },
        { label: t('widget.tableCode'), dataKey: 'code' },
        {
          label: t('widget.tableActive'),
          dataKey: 'isActive',
          Cell: ({ row }) => (
            <ToggleWidget
              isChecked={row?.isActive}
              onChange={(status) => updateClosure(row, 'isActive', status)}
            />
          ),
        },
      ]}
      actions={{
        edit: onUpdateClick,
        delete: onDeleteClick,
      }}
    />
  );
};
export default WidgetTable;
