import React, { useRef } from 'react';
import useWidget from '../../../hooks/useWidget';
import WidgetContextProvider from '../../../context/WidgetContext';
import { createTranslation } from '../../../helper/utils';
import {
  TRANSLATION_PAIRS_COMMON,
  TRANSLATION_PAIRS_WIDGET,
  TRANSLATION_PAIRS_ITEM,
  DEFAULT_PERMISSIONS,
} from '../../../constants/common';
import { WidgetProps } from '../../../types';

import Table from '../Table';
import WidgetForm from '../Form';
import AddButton from '../AddButton';
import Pagination from '../Pagination';
import WidgetSearch from '../Search';
import Drawer from '../../common/Drawer';
import DeleteModal from '../../common/DeleteModal';
import WidgetFormActions from '../WidgetFormActions';
import WiddgetFormWrapper from '../WidgetFormWrapper';

const Widget = ({
  t,
  routes,
  loader,
  explicitForm = false,
  permissions = DEFAULT_PERMISSIONS,
  preConfirmDelete,
  formatListItem,
  formatOptionLabel,
  children,
}: WidgetProps) => {
  const widgetFormRef = useRef<HTMLFormElement | null>(null);
  const derivedT = createTranslation(t, {
    ...TRANSLATION_PAIRS_COMMON,
    ...TRANSLATION_PAIRS_WIDGET,
    ...TRANSLATION_PAIRS_ITEM,
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
    onDeleteItem,
    onImageRemove,
    onImageUpload,
    onPartialUpdateWidget,
    itemsTypes,
    widgetTypes,
    getCollectionData,
    collectionData,
    collectionDataLoading,
    // Pagination
    totalPages,
    totalRecords,
    currentPage,
    pageSize,
    setCurrentPage,
    // Item
    itemsList,
    itemsLoading,
    onItemFormSubmit,
  } = useWidget({
    routes,
    defaultLimit: 10,
    preConfirmDelete,
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
      onDeleteItem={onDeleteItem}
      getWidgets={getWidgets}
      onImageRemove={onImageRemove}
      onImageUpload={onImageUpload}
      onPartialUpdateWidget={onPartialUpdateWidget}
      itemsTypes={itemsTypes}
      widgetTypes={widgetTypes}
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
      // Item
      webItems={itemsList.web}
      mobileItems={itemsList.mobile}
      itemsLoading={itemsLoading}
      onItemFormSubmit={onItemFormSubmit}
      // Permissions
      canAdd={permissions.add}
      canDelete={permissions.delete}
      canList={permissions.list}
      canUpdate={permissions.update}
      canPartialUpdate={permissions.partialUpdate}
      formState={formState}
      closeForm={onCloseForm}
    >
      {children ? (
        children
      ) : (
        <>
          <AddButton />
          <WidgetSearch />
          <div className="khb_table-wrapper">
            <Table />
            <Pagination />
          </div>
        </>
      )}

      {!explicitForm && (
        <Drawer
          open={formState === 'ADD' || formState === 'UPDATE'}
          onClose={onCloseForm}
          title={
            formState === 'ADD'
              ? derivedT('widget.addWidgetTitle')
              : formState === 'UPDATE'
              ? derivedT('widget.updateWidgetTitle')
              : ''
          }
          footerContent={<WidgetFormActions formRef={widgetFormRef} />}
        >
          <WidgetForm formRef={widgetFormRef} />
        </Drawer>
      )}
      {itemData && (
        <DeleteModal
          formState={formState}
          itemData={itemData}
          onClose={onCloseForm}
          onConfirmDelete={onCofirmDeleteWidget}
        />
      )}
    </WidgetContextProvider>
  );
};

Widget.Table = Table;
Widget.Form = WidgetForm;
Widget.AddButton = AddButton;
Widget.Search = WidgetSearch;
Widget.Pagination = Pagination;
Widget.FormWrapper = WiddgetFormWrapper;
Widget.FormActions = WidgetFormActions;

export default Widget;
