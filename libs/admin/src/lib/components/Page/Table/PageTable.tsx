import React from 'react';
import Table from '../../common/Table';
import { usePageState } from '../../../context/PageContext';
import { CombineObjectType, DerivedTableProps } from '../../../types';

const PageTable = ({ extraActions, extraColumns }: DerivedTableProps) => {
  const { list, onChangeFormState, t, loading, loader, canUpdate, canDelete } =
    usePageState();
  const onUpdateClick = (item: CombineObjectType) =>
    onChangeFormState('UPDATE', item);
  const onDeleteClick = (item: CombineObjectType) =>
    onChangeFormState('DELETE', item);

  return (
    <Table
      data={list}
      loader={loader}
      loading={loading}
      dataKeys={[
        { label: t('page.tableName'), dataKey: 'name', highlight: true },
        { label: t('page.tableCode'), dataKey: 'code' },
      ]}
      actionsLabel={t('page.actionsLabel')}
      actions={{
        edit: canUpdate ? onUpdateClick : undefined,
        delete: canDelete ? onDeleteClick : undefined,
      }}
      extraColumns={extraColumns}
      extraActions={extraActions}
    />
  );
};
export default PageTable;
