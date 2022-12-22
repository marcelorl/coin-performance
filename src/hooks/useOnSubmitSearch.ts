import { useState } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import { fetchTimeSeriesDaily } from "../services/services.general";
import {
  IFetchTimeSeriesDailyResult,
  LineChartData,
} from "../types/general.types";

dayjs.extend(isSameOrBefore);

const filterMap = {
  week: [1, "week"] as const,
  month: [1, "month"] as const,
  year: [1, "year"] as const,
};

const getFirstValidDate = (
  arr: IFetchTimeSeriesDailyResult[],
  targetDate: string
): IFetchTimeSeriesDailyResult => {
  for (let i = 0; i < arr.length; i++) {
    if (dayjs(arr[i][0]).isSameOrBefore(targetDate)) {
      return arr[i];
    }
  }
  return arr[arr.length - 1];
};

export const useOnSubmitSearch = () => {
  const [data, setData] = useState<LineChartData>({} as LineChartData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [csvReport, setCsvReport] = useState<{
    data: object[];
    filename: string;
  }>();

  const onSubmit = async (symbol: string, timeRange: string) => {
    setData({} as LineChartData);
    setIsLoading(true);
    const csvData: object[] = [];

    await Promise.all([
      fetchTimeSeriesDaily(symbol),
      fetchTimeSeriesDaily("spy"),
    ])
      .then((res) => {
        const [symbolRes, spyRes] = res;
        const [lastDate] = spyRes[0];

        const targetDate = dayjs(lastDate)
          // @ts-ignore
          .subtract(...filterMap[timeRange])
          .format("YYYY-MM-DD");

        const symbolFirstDate = getFirstValidDate(symbolRes, targetDate);
        const spyFirstDate = getFirstValidDate(spyRes, targetDate);

        const initialData: LineChartData = {
          labels: [],
          datasets: [
            {
              label: `${symbol}`,
              data: [],
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              label: `SPY`,
              data: [],
              borderColor: "rgb(236, 54, 54)",
              backgroundColor: "rgba(236, 54, 54, 0.5)",
            },
          ],
        };

        for (let i = 0; i < spyRes.length; i++) {
          const [spyLabel, spyValue] = spyRes[i];
          const [, symbolValue] = symbolRes[i];
          initialData.labels?.unshift(spyLabel);

          const spyCoordinate = Number(
            (Number(spyValue["1. open"]) * 100) /
              Number(spyFirstDate[1]["1. open"]) -
              100
          ).toFixed(2);
          const symbolCoordinate = Number(
            (Number(symbolValue["1. open"]) * 100) /
              Number(symbolFirstDate[1]["1. open"]) -
              100
          ).toFixed(2);

          csvData.unshift({
            label: spyLabel,
            [`${symbol}-performance`]: symbolCoordinate,
            [`${symbol}-open`]: symbolValue["1. open"],
            "spy-performance": spyCoordinate,
            "spy-open": spyValue["1. open"],
          });

          initialData.datasets[0].data.unshift(Number(symbolCoordinate));
          initialData.datasets[1].data.unshift(Number(spyCoordinate));

          if (spyLabel === spyFirstDate[0]) {
            break;
          }
        }

        setIsLoading(false);
        setCsvReport({
          data: csvData,
          filename: `${symbol}_${timeRange}_performance_report.csv`,
        });

        return initialData;
      })
      .then(setData);
  };

  return { data, onSubmit, isLoading, csvReport };
};
