import { Chart } from "./Chart";
import { useOnClickSymbol } from "../hooks/useOnClickSymbol";
import { Typeahead } from "./Typeahead";

const App = () => {
  const { data, onClick } = useOnClickSymbol();

  return (
    <div className="app">
      <header className="w-full h-3">
        <Typeahead onSelectSymbol={onClick} />
      </header>
      <Chart data={data} />
    </div>
  );
};

export default App;
