import { FormEvent, useState } from "react";

import { Chart } from "./Chart";
import { SelectTimeRange } from "./SelectTimeRange";
import { Typeahead } from "./Typeahead";
import { useOnSubmitSearch } from "../hooks/useOnSubmitSearch";

const App = () => {
  const [timeRange, setTimeRange] = useState("");
  const [symbol, setSymbol] = useState("");
  const { data, onSubmit } = useOnSubmitSearch();

  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(symbol, timeRange);
  };

  return (
    <div className="app">
      <header className="w-full">
        <form onSubmit={onSubmitSearch} className="w-full flex p-3 gap-5">
          <Typeahead onSelectSymbol={setSymbol} />
          <SelectTimeRange onChange={setTimeRange} />
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 ml-10 py-2.5 text-center">
            Search
          </button>
        </form>
      </header>
      <Chart data={data} />
    </div>
  );
};

export default App;
