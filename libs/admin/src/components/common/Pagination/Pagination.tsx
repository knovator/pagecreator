import { useState } from 'react';
import { PaginationProps } from '../../../types';
import { TRANSLATION_PAIRS_COMMON } from '../../../constants/common';
import ChevronLeft from '../../../icons/chevronLeft';
import ChevronRight from '../../../icons/chevronRight';
import Button from '../Button';
import Input from '../Input';

const Pagination = ({
  currentPage,
  pageSize,
  totalPages,
  totalRecords,
  setCurrentPage,
  showingText = TRANSLATION_PAIRS_COMMON.showing,
  pageText = TRANSLATION_PAIRS_COMMON.page,
  ofText = TRANSLATION_PAIRS_COMMON.of,
}: PaginationProps) => {
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const updatePagination = () => {
    let newValue: number | string | undefined = localCurrentPage;
    if (newValue) {
      if (newValue <= 0) {
        newValue = 1;
      } else if (newValue > totalPages) {
        newValue = totalPages;
      }
      setCurrentPage(newValue);
      setLocalCurrentPage(newValue);
    }
  };
  const onPaginationButtonClick = (dir: 'next' | 'previous') => {
    if (dir === 'next') {
      setCurrentPage(currentPage + 1);
      setLocalCurrentPage(localCurrentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
      setLocalCurrentPage(localCurrentPage - 1);
    }
  };
  return (
    <nav className="khb_pagination" aria-label="Table navigation">
      <span className="khb_pagination-total">
        {showingText}{' '}
        <span className="khb_pagination-total-showing">
          {(currentPage - 1) * pageSize + 1}
        </span>{' '}
        -{' '}
        <span className="khb_pagination-total-showing">
          {Math.min(currentPage * pageSize, totalRecords)}
        </span>{' '}
        {ofText} {totalRecords}
      </span>
      <ul className="khb_pagination-actions">
        <Button
          size="xs"
          type="secondary"
          disabled={currentPage - 1 === 0}
          onClick={() => onPaginationButtonClick('previous')}
        >
          <ChevronLeft srText="Previous" />
        </Button>
        <div className="khb_pagination-pager">
          {pageText}{' '}
          <Input
            className="mx-2"
            size="xs"
            type="number"
            id="page"
            value={localCurrentPage}
            onChange={(e) => setLocalCurrentPage(Number(e.target.value))}
            onBlur={updatePagination}
          />{' '}
          / {totalPages}
        </div>
        <Button
          size="xs"
          type="secondary"
          disabled={currentPage === totalPages}
          onClick={() => onPaginationButtonClick('next')}
        >
          <ChevronRight srText="Next" />
        </Button>
      </ul>
    </nav>
  );
};

export default Pagination;
