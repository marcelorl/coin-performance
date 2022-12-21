import debounce from "lodash.debounce";
import { useCallback, useState } from "react";

import { IFetchSymbolsMatchResult } from "../types/general.types";
import { fetchSymbols } from "../services/services.general";

export const useOnChangeTypeahead = () => {
  const [list, setList] = useState<IFetchSymbolsMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeInner = (keyword: string) => {
    if (keyword.length) {
      setIsLoading(true);
      fetchSymbols(keyword)
        .then(setList)
        .then(() => setIsLoading(false));
    } else {
      setList([]);
    }
  };
  const onChange = useCallback(debounce(onChangeInner, 500), []);

  return { list, setList, onChange, isLoading };
};
