import React, { useRef, useState } from 'react';
import Input from '../../common/Input';
import { useWidgetState } from '../../../context/WidgetContext';

const WidgetSearch = () => {
  const { changeSearch, t, canList, setCurrentPage } = useWidgetState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchVal, setSearchVal] = useState<string>();

  const onChangeSearch = (str: string) => {
    setSearchVal(str);
    changeSearch(str);
    if (callerRef.current) clearTimeout(callerRef.current);

    callerRef.current = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
  };

  return (
    <Input
      type="search"
      value={searchVal}
      disabled={!canList}
      onChange={(e) => onChangeSearch(e.target.value)}
      placeholder={t('widget.searchPlaceholder')}
    />
  );
};

export default WidgetSearch;
