import { useState } from "react";

import { fetchTimeSeriesDaily } from "../services/services.general";
import { LineChartData } from "../types/general.types";

const filterMap: { [key: string]: number } = {
  week: 6,
  month: 30,
  year: 365,
};

export const useOnSubmitSearch = () => {
  const [data, setData] = useState<LineChartData>({} as LineChartData);

  const onSubmit = (symbol: string, timeRange: string) => {
    fetchTimeSeriesDaily(symbol)
      .then((res) => {
        const listData: [string, { "1. open": string }][] = Object.entries(res);
        const [firstLabel, firstValue] = listData[filterMap[timeRange]];
        const initialData: LineChartData = {
          labels: [firstLabel],
          datasets: [
            {
              label: `${symbol} Performance`,
              data: [0],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        };

        for (let i = filterMap[timeRange] - 1; i >= 0; i--) {
          const [label, value] = listData[i];

          initialData!.labels!.push(label);
          const newSet = Number(
            (Number(value["1. open"]) * 100) / Number(firstValue["1. open"]) -
              100
          ).toFixed(2);
          initialData.datasets[0].data.push(Number(newSet));
        }

        return initialData;
      })
      .then(setData);
  };

  return { data, onSubmit };
};
