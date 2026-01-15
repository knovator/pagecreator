import React from "react";
import { usePageState } from "../../../context/PageContext";
import Pagination from "../../common/Pagination";
import { useProviderState } from '../../../context/ProviderContext';

const PagePagination = () => {
  const { commonTranslations } = useProviderState();
  const { totalPages, totalRecords, currentPage, pageSize, setCurrentPage } =
    usePageState();
  return (
    <Pagination
      ofText={commonTranslations.of}
      pageText={commonTranslations.confirm}
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

export default PagePagination;
