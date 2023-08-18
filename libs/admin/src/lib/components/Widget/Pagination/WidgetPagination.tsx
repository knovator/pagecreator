import React from 'react';
import { useWidgetState } from '../../../context/WidgetContext';
import Pagination from '../../common/Pagination';

const WidgetPagination = () => {
  const { t, totalPages, totalRecords, currentPage, pageSize, setCurrentPage } =
    useWidgetState();
  return (
    <Pagination
      ofText={t('of') || t('common:of')}
      pageText={t('confirm') || t('common:confirm')}
      showingText={t('showing') || t('common:showing')}
      nextContent={t('nextContent') || t('common:nextContent')}
      previousContent={t('previousContent') || t('common:previousContent')}
      totalPages={totalPages}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default WidgetPagination;
