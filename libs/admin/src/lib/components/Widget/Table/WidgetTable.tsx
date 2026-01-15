import React, { useCallback } from 'react';
import Table from '../../common/Table';
import ToggleWidget from '../../common/Toggle';
import { useWidgetState } from '../../../context/WidgetContext';
import {
  CombineObjectType,
  DerivedTableProps,
  ObjectType,
  ValuesType,
} from '../../../types';
import { useProviderState } from '../../../context/ProviderContext';

const WidgetTable = ({ extraActions, extraColumns }: DerivedTableProps) => {
  const { commonTranslations, switchClass } = useProviderState();
  const {
    list,
    canUpdate,
    canDelete,
    canPartialUpdate,
    onChangeFormState,
    onPartialUpdateWidget,
    loading,
    loader,
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
    { label: commonTranslations.name, dataKey: 'name', highlight: true },
    { label: commonTranslations.code, dataKey: 'code' },
  ];
  if (canPartialUpdate)
    dataKeys.push({
      label: commonTranslations.active,
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
      dataKeys={dataKeys}
      actionsLabel={commonTranslations.actions}
      extraColumns={extraColumns}
      extraActions={extraActions}
      actions={{
        edit: canUpdate ? onUpdateClick : false,
        delete: canDelete ? onDeleteClick : false,
      }}
    />
  );
};
export default WidgetTable;
