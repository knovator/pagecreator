import React, { useRef } from 'react';
import useWidget from '../../../hooks/useWidget';
import WidgetContextProvider from '../../../context/WidgetContext';
import {
  TRANSLATION_PAIRS_WIDGET,
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
import { useProviderState } from '../../../context/ProviderContext';

const Widget = ({
  routes,
  loader,
  explicitForm = false,
  imageBaseUrl,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  permissions = {},
  preConfirmDelete,
  formatListItem,
  formatOptionLabel,
  imageMaxSize,
  translations,
  children,
}: WidgetProps) => {
  const { commonTranslations } = useProviderState();
  const derivedPermissions = Object.assign(DEFAULT_PERMISSIONS, permissions);
  const widgetFormRef = useRef<HTMLFormElement | null>(null);
  const derivedT = {
    ...TRANSLATION_PAIRS_WIDGET,
    ...(translations || {}),
  };
  const {
    list,
    loading,
    searchText,
    changeSearch,
    onChangeFormState,
    formState,
    onCloseForm,
    onWidgetFormSubmit,
    itemData,
    getWidgets,
    onCofirmDeleteWidget,
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
    languages,
    setCurrentPage,
  } = useWidget({
    canList: derivedPermissions.list,
    routes,
    defaultLimit: 10,
    preConfirmDelete,
    imageBaseUrl,
  });
  return (
    <WidgetContextProvider
      loading={loading}
      list={list}
      languages={languages}
      imageBaseUrl={imageBaseUrl}
      onChangeFormState={onChangeFormState}
      searchText={searchText}
      changeSearch={changeSearch}
      loader={loader}
      onWidgetFormSubmit={onWidgetFormSubmit}
      data={itemData}
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
      // Permissions
      canAdd={derivedPermissions.add}
      canDelete={derivedPermissions.delete}
      canList={derivedPermissions.list}
      canUpdate={derivedPermissions.update}
      canPartialUpdate={derivedPermissions.partialUpdate}
      formState={formState}
      closeForm={onCloseForm}
      imageMaxSize={imageMaxSize}
      widgetTranslations={translations}
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
              ? derivedT.addWidgetTitle
              : formState === 'UPDATE'
              ? derivedT.updateWidgetTitle
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
          confirmationRequired={commonTranslations.confirmationRequired}
          confirm={commonTranslations.confirm}
          lossOfData={commonTranslations.lossOfData}
          permanentlyDelete={commonTranslations.permanentlyDelete}
          pleaseType={commonTranslations.pleaseType}
          toProceedOrCancel={commonTranslations.toProceedOrCancel}
          typeHerePlaceholder={commonTranslations.typeHerePlaceholder}
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
