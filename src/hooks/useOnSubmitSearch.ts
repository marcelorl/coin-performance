import { useState } from "react";
import { fetchTimeSeries } from "../services/services.general";

const filterMap: { [key: string]: number } = {
  week: 6,
  month: 30,
  year: 365,
};

export const useOnSubmitSearch = () => {
  const [data, setData] = useState<any>({});

  const onSubmit = (symbol: string, timeRange: string) => {
    fetchTimeSeries(symbol)
      .then((res) => {
        const listData = Object.entries(res);
        const [firstLabel, firstValue] = listData[filterMap[timeRange]] as any;
        const initialData = {
          labels: [firstLabel] as string[],
          datasets: [
            {
              label: `${symbol} Performance`,
              data: ["0"] as string[],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };

        for (let i = filterMap[timeRange] - 1; i >= 0; i--) {
          const [label, value] = listData[i] as any;

          initialData.labels.push(label);
          const newSet = Number(
            (Number(value["1. open"]) * 100) / Number(firstValue["1. open"]) -
              100
          ).toFixed(2);
          initialData.datasets[0].data.push(newSet);
        }

        return initialData;
      })
      .then(setData);
  };

  return { data, onSubmit };
};
