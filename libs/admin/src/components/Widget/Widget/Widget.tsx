import React from 'react';
import useWidget from '../../../hooks/useWidget';
import WidgetContextProvider from '../../../context/WidgetContext';
import { createTranslation } from '../../../helper/utils';
import {
  TRANSLATION_PAIRS_COMMON,
  TRANSLATION_PAIRS_WIDGET,
  TRANSLATION_PAIRS_TILES,
  DEFAULT_PERMISSIONS,
} from '../../../constants/common';

import Table from '../Table';
import WidgetForm from '../Form';
import AddButton from '../AddButton';
import Pagination from '../Pagination';
import WidgetSearch from '../Search';
import DeleteModal from '../../common/DeleteModal';
import { WidgetProps } from 'libs/admin/src/types';

const Widget = ({
  t,
  loader,
  permissions = DEFAULT_PERMISSIONS,
  formatListItem,
  formatOptionLabel,
}: WidgetProps) => {
  const derivedT = createTranslation(t, {
    ...TRANSLATION_PAIRS_COMMON,
    ...TRANSLATION_PAIRS_WIDGET,
    ...TRANSLATION_PAIRS_TILES,
  });
  const {
    list,
    loading,
    onChangeFormState,
    formState,
    onCloseForm,
    onWidgetFormSubmit,
    itemData,
    getWidgets,
    onCofirmDeleteWidget,
    onDeleteTile,
    onImageRemove,
    onImageUpload,
    onPartialUpdateWidget,
    widgetTypes,
    selectionTypes,
    getCollectionData,
    collectionData,
    collectionDataLoading,
    // Pagination
    totalPages,
    totalRecords,
    currentPage,
    pageSize,
    setCurrentPage,
    // Tile
    tilesList,
    tilesLoading,
    onTileFormSubmit,
  } = useWidget({
    defaultLimit: 10,
  });
  return (
    <WidgetContextProvider
      loading={loading}
      list={list}
      onChangeFormState={onChangeFormState}
      t={derivedT}
      loader={loader}
      onWidgetFormSubmit={onWidgetFormSubmit}
      data={itemData}
      onDeleteTile={onDeleteTile}
      getWidgets={getWidgets}
      onImageRemove={onImageRemove}
      onImageUpload={onImageUpload}
      onPartialUpdateWidget={onPartialUpdateWidget}
      widgetTypes={widgetTypes}
      selectionTypes={selectionTypes}
      getCollectionData={getCollectionData}
      collectionData={collectionData}
      collectionDataLoading={collectionDataLoading}
      formatListItem={formatListItem}
      formatOptionLabel={formatOptionLabel}
      // Pagination
      totalPages={totalPages}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      // Tile
      tilesList={tilesList}
      tilesLoading={tilesLoading}
      onTileFormSubmit={onTileFormSubmit}
      // Permissions
      canAdd={permissions.add}
      canDelete={permissions.delete}
      canList={permissions.list}
      canUpdate={permissions.update}
      canPartialUpdate={permissions.partialUpdate}
    >
      <AddButton />
      <WidgetSearch />
      <div className="khb_table-wrapper">
        <Table />
        <Pagination />
      </div>
      <WidgetForm
        open={formState === 'ADD' || formState === 'UPDATE'}
        onClose={onCloseForm}
        formState={formState}
      />
      <DeleteModal
        formState={formState}
        itemData={itemData}
        onClose={onCloseForm}
        onConfirmDelete={onCofirmDeleteWidget}
      />
    </WidgetContextProvider>
  );
};

Widget.Table = Table;

export default Widget;
