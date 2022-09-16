import { useRef } from 'react';
import usePage from '../../../hooks/usePage';
import { createTranslation } from '../../../helper/utils';
import PageContextProvider from '../../../context/PageContext';
import {
  DEFAULT_PERMISSIONS,
  TRANSLATION_PAIRS_COMMON,
  TRANSLATION_PAIRS_PAGE,
} from '../../../constants/common';
import { PageProps } from '../../../types';

import Table from '../Table';
import Search from '../Search';
import PageForm from '../Form';
import AddButton from '../AddButton';
import Pagination from '../Pagination';
import DeleteModal from '../../common/DeleteModal';
import Drawer from '../../common/Drawer';
import PageFormActions from '../PageFormActions';
import PageFormWrapper from '../PageFormWrapper';

const Page = ({
  t,
  loader,
  explicitForm = false,
  children,
  permissions = DEFAULT_PERMISSIONS,
}: PageProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const derivedT = createTranslation(t, {
    ...TRANSLATION_PAIRS_COMMON,
    ...TRANSLATION_PAIRS_PAGE,
  });
  const {
    list,
    widgets,
    loading,
    totalPages,
    totalRecords,
    currentPage,
    pageSize,
    itemData,
    setCurrentPage,
    formState,
    onChangeFormState,
    onPageFormSubmit,
    onCloseForm,
    selectedWidgets,
    setSelectedWidgets,
    onCofirmDeletePage,
    onChangeWidgetSequence,
    getPages,
  } = usePage({
    defaultLimit: 10,
  });

  return (
    <PageContextProvider
      t={derivedT}
      loader={loader}
      list={list}
      widgets={widgets}
      data={itemData}
      loading={loading}
      totalPages={totalPages}
      totalRecords={totalRecords}
      currentPage={currentPage}
      onChangeFormState={onChangeFormState}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      onPageFormSubmit={onPageFormSubmit}
      selectedWidgets={selectedWidgets}
      setSelectedWidgets={setSelectedWidgets}
      onChangeWidgetSequence={onChangeWidgetSequence}
      getPages={getPages}
      formState={formState}
      closeForm={onCloseForm}
      // permissions
      canAdd={permissions?.add}
      canDelete={permissions?.delete}
      canUpdate={permissions?.update}
      canList={permissions?.list}
    >
      {children ? (
        children
      ) : (
        <>
          <AddButton />
          <Search />
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
              ? derivedT('page.addPageTitle')
              : formState === 'UPDATE'
              ? derivedT('page.updatePageTitle')
              : ''
          }
          footerContent={<PageFormActions formRef={formRef} />}
        >
          <PageForm formState={formState} formRef={formRef} />
        </Drawer>
      )}
      {itemData && (
        <DeleteModal
          formState={formState}
          itemData={itemData}
          onClose={onCloseForm}
          onConfirmDelete={onCofirmDeletePage}
        />
      )}
    </PageContextProvider>
  );
};

Page.Table = Table;
Page.Search = Search;
Page.Form = PageForm;
Page.AddButton = AddButton;
Page.Pagination = Pagination;
Page.FormActions = PageFormActions;
Page.FormWrapper = PageFormWrapper;

export default Page;
