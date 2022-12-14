import React from 'react';
import Table from '../../common/Table';
import { usePageState } from '../../../context/PageContext';
import { CombineObjectType } from '../../../types';

const PageTable = () => {
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
      actions={{
        edit: canUpdate ? onUpdateClick : undefined,
        delete: canDelete ? onDeleteClick : undefined,
      }}
    />
  );
};
export default PageTable;
