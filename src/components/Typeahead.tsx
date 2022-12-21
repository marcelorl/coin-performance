import { useOnChangeTypeahead } from "../hooks/useOnChangeTypeahead";
import { FC } from "react";

type TypeaheadProps = {
  onSelectSymbol: any;
};

export const Typeahead: FC<TypeaheadProps> = ({ onSelectSymbol }) => {
  const { list, onChange } = useOnChangeTypeahead();

  return (
    <div>
      <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="keyword ..."
        className=""
      />
      <ul>
        {list.map((item) => (
          <li
            className="cursor-pointer"
            key={item["1. symbol"]}
            onClick={() => onSelectSymbol(item["1. symbol"])}
          >
            {item["1. symbol"]} - {item["2. name"]}
          </li>
        ))}
      </ul>
    </div>
  );
};
