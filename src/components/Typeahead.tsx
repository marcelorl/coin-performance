import { useOnChangeTypeahead } from "../hooks/useOnChangeTypeahead";
import { FC, useEffect, useRef } from "react";

type TypeaheadProps = {
  onSelectSymbol: (symbol: string) => void;
};

export const Typeahead: FC<TypeaheadProps> = ({ onSelectSymbol }) => {
  const { list, setList, onChange } = useOnChangeTypeahead();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef!.current && inputRef.current.focus();
  }, []);

  const onSelect = (symbol: string) => {
    onSelectSymbol(symbol);
    setList([]);
    inputRef!.current!.value = symbol;
  };

  return (
    <div className="relative">
      <input
        required
        ref={inputRef}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="symbol ..."
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      <ul className="fixed z-10 shadow-[0_1px_10px_rgba(74,74,74,0.07)]">
        {list.map((item) => (
          <li
            className="cursor-pointer bg-white hover:bg-blue-100 p-2"
            key={item["1. symbol"]}
            onClick={() => onSelect(item["1. symbol"])}
          >
            {item["1. symbol"]} - {item["2. name"]}
          </li>
        ))}
      </ul>
    </div>
  );
};
