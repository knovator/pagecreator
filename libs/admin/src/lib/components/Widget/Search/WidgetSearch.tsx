import React, { useRef, useState } from 'react';
import Input from '../../common/Input';
import { useWidgetState } from '../../../context/WidgetContext';

const WidgetSearch = () => {
  const { getWidgets, t, canList } = useWidgetState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState<string>('');

  const onChangeSearch = (str: string) => {
    setSearch(str);
    if (callerRef.current) clearTimeout(callerRef.current);

    callerRef.current = setTimeout(() => {
      getWidgets(str);
    }, 300);
  };

  return (
    <Input
      type="search"
      value={search}
      disabled={!canList}
      onChange={(e) => onChangeSearch(e.target.value)}
      placeholder={t('widget.searchPlaceholder')}
    />
  );
};

export default WidgetSearch;
