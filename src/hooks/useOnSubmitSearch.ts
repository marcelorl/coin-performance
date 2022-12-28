import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
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

const formatDate = "YYYY-MM-DD";

const getFirstValidDate = (
  obj: IFetchTimeSeriesDailyResult,
  targetDate: Dayjs
): string => {
  while (!obj[targetDate.format(formatDate)]) {
    targetDate = targetDate.add(1, "day");
  }
  return obj[targetDate.format(formatDate)]["1. open"];
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

        let targetDate = dayjs()
          // @ts-ignore
          .subtract(...filterMap[timeRange]);

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

        while (targetDate.isSameOrBefore(dayjs())) {
          const label = targetDate.format(formatDate);
          const spyValue = spyRes[label];
          const symbolValue = symbolRes[label];

          if (!spyValue) {
            targetDate = targetDate.add(1, "day");
            continue;
          }

          initialData.labels?.push(label);

          const spyCoordinate = Number(
            (Number(spyValue["1. open"]) * 100) / Number(spyFirstDate) - 100
          ).toFixed(2);
          let symbolCoordinate = "0";
          if (symbolValue) {
            symbolCoordinate = Number(
              (Number(symbolValue["1. open"]) * 100) / Number(symbolFirstDate) -
                100
            ).toFixed(2);
          }

          initialData.datasets[0].data.push(Number(symbolCoordinate));
          initialData.datasets[1].data.push(Number(spyCoordinate));

          csvData.unshift({
            label,
            [`${symbol}-performance`]: symbolCoordinate,
            [`${symbol}-open`]: symbolValue ? symbolValue["1. open"] : "N/A",
            "spy-performance": spyCoordinate,
            "spy-open": spyValue["1. open"],
          });

          targetDate = targetDate.add(1, "day");
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
