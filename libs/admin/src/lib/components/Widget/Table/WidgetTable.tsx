import React, { useCallback } from 'react';
import Table from '../../common/Table';
import ToggleWidget from '../../common/Toggle';
import { useWidgetState } from '../../../context/WidgetContext';
import { CombineObjectType, ObjectType, ValuesType } from '../../../types';
import { useProviderState } from '../../../context/ProviderContext';

const WidgetTable = () => {
  const { switchClass } = useProviderState();
  const {
    list,
    canUpdate,
    canDelete,
    canPartialUpdate,
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

  const dataKeys: any[] = [
    { label: t('widget.tableName'), dataKey: 'name', highlight: true },
    { label: t('widget.tableCode'), dataKey: 'code' },
  ];
  if (canPartialUpdate)
    dataKeys.push({
      label: t('widget.tableActive'),
      dataKey: 'isActive',
      Cell: ({ row }: any) =>
        canPartialUpdate ? (
          <ToggleWidget
            switchClass={switchClass}
            isChecked={row?.isActive}
            onChange={(status) => updateClosure(row, 'isActive', status)}
          />
        ) : null,
    });

  return (
    <Table
      data={list}
      loader={loader}
      loading={loading}
      dataKeys={[
        { label: t('widget.tableName'), dataKey: 'name', highlight: true },
        { label: t('widget.tableCode'), dataKey: 'code' },
      ]}
      actions={{
        edit: canUpdate ? onUpdateClick : false,
        delete: canDelete ? onDeleteClick : false,
      }}
    />
  );
};
export default WidgetTable;
