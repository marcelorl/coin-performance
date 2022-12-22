import { FormEvent, useState } from "react";
import { CSVLink } from "react-csv";

import { Chart } from "./Chart";
import { SelectTimeRange } from "./SelectTimeRange";
import { Typeahead } from "./Typeahead";
import { useOnSubmitSearch } from "../hooks/useOnSubmitSearch";

const App = () => {
  const [timeRange, setTimeRange] = useState("");
  const [symbol, setSymbol] = useState("");
  const { data, onSubmit, isLoading, csvReport } = useOnSubmitSearch();

  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(symbol, timeRange);
  };

  return (
    <div className="app flex flex-col">
      <header className="w-full">
        <form
          onSubmit={onSubmitSearch}
          className="w-full flex p-3 gap-5 lg:flex-row flex-col"
        >
          <Typeahead onSelectSymbol={setSymbol} />
          <SelectTimeRange onChange={setTimeRange} />
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 lg:ml-10 py-2.5 text-center">
            Search
          </button>
          {csvReport && (
            <CSVLink
              {...csvReport}
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Export to CSV
            </CSVLink>
          )}
        </form>
      </header>
      {Boolean(Object.keys(data).length) && <Chart data={data} />}
      {isLoading && (
        <div className="w-full flex flex-1 justify-center items-center">
          Loading ...
        </div>
      )}
    </div>
  );
};

export default App;
