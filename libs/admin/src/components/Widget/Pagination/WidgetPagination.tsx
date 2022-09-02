import { useWidgetState } from '../../../context/WidgetContext';
import Pagination from '../../common/Pagination';

const WidgetPagination = () => {
  const { t, totalPages, totalRecords, currentPage, pageSize, setCurrentPage } =
    useWidgetState();
  return (
    <Pagination
      ofText={t('of')}
      pageText={t('page')}
      showingText={t('showing')}
      totalPages={totalPages}
      totalRecords={totalRecords}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default WidgetPagination;
