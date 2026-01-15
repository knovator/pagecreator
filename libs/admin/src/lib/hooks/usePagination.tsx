import { useRef } from 'react';
import * as constants from '../constants/common';

interface UsePaginationProps {
  defaultLimit?: number;
}

const usePagination = ({ defaultLimit }: UsePaginationProps) => {
  const offsetRef = useRef<number>(constants.DEFAULT_OFFSET_PAYLOAD);
  const limitRef = useRef<number>(defaultLimit || constants.DEFAULT_LIMIT);
  const currentPageRef = useRef<number>(constants.DEFAULT_CURRENT_PAGE);
  const searchRef = useRef<string>('');

  const setPageSize = (value: number) => {
    limitRef.current = Number.parseInt(String(value), constants.DECIMAL_REDIX);
    offsetRef.current = constants.DEFAULT_OFFSET_PAYLOAD;
    currentPageRef.current = constants.DEFAULT_CURRENT_PAGE;
  };

  const changeSearch = (value: string) => {
    searchRef.current = value;
  };

  const changeCurrentPage = (value: number) => {
    currentPageRef.current = value;
    offsetRef.current = value * limitRef.current;
  };

  return {
    pageSize: limitRef.current,
    currentPageRef,
    limitRef,
    offsetRef,
    searchRef,
    setPageSize,
    changeSearch,
    setCurrentPage: changeCurrentPage,
  };
};

export default usePagination;
