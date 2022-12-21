import { useCallback, useState } from "react";
import { IFetchSymbolsMatch } from "../types/general.types";
import { fetchSymbols } from "../services/services.general";
import debounce from "lodash.debounce";

export const useOnChangeTypeahead = () => {
  const [list, setList] = useState<IFetchSymbolsMatch[]>([]);

  const onChangeInner = (keyword: string) => {
    if (keyword.length) {
      fetchSymbols(keyword).then(setList);
    } else {
      setList([]);
    }
  };
  const onChange = useCallback(debounce(onChangeInner, 500), []);

  return { list, setList, onChange };
};
