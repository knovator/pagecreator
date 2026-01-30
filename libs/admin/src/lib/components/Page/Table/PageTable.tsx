import React from 'react';
import Table from '../../common/Table';
import { usePageState } from '../../../context/PageContext';
import { useProviderState } from '../../../context/ProviderContext';
import { CombineObjectType, DerivedTableProps } from '../../../types';

const PageTable = ({ extraActions, extraColumns }: DerivedTableProps) => {
  const { commonTranslations } = useProviderState();
  const { list, onChangeFormState, loading, loader, canUpdate, canDelete } =
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
        { label: commonTranslations.name, dataKey: 'name', highlight: true },
        { label: commonTranslations.code, dataKey: 'code' },
      ]}
      actionsLabel={commonTranslations.actions}
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
