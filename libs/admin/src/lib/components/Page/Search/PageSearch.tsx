import React, { useRef, useState } from "react";
import Input from "../../common/Input";
import { usePageState } from "../../../context/PageContext";

const PageSearch = () => {
	const { getPages, t, canList } = usePageState();
  const callerRef = useRef<NodeJS.Timeout | null>(null);
  const [search, setSearch] = useState<string>('');

  const onChangeSearch = (str: string) => {
    setSearch(str);
    if (callerRef.current) clearTimeout(callerRef.current);

    callerRef.current = setTimeout(() => {
      getPages(str);
    }, 300);
  };

  return (
    <Input
      type="search"
      value={search}
      disabled={!canList}
      onChange={(e) => onChangeSearch(e.target.value)}
      placeholder={t('page.searchPages')}
    />
  );
};

export default PageSearch;
