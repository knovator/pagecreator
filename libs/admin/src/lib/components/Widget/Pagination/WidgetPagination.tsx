import React from 'react';
import Pagination from '../../common/Pagination';
import { useWidgetState } from '../../../context/WidgetContext';
import { useProviderState } from '../../../context/ProviderContext';

const WidgetPagination = () => {
  const { commonTranslations } = useProviderState();
  const { totalPages, totalRecords, currentPage, pageSize, setCurrentPage } =
    useWidgetState();
  return (
    <Pagination
      ofText={commonTranslations.of}
      pageText={commonTranslations.page}
      showingText={commonTranslations.showing}
      nextContent={commonTranslations.next}
      previousContent={commonTranslations.previous}
      totalPages={totalPages}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default WidgetPagination;
