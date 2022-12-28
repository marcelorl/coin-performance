import { ChartData, DefaultDataPoint } from "chart.js";

export interface IFetchSymbolsResponse {
  bestMatches: IFetchSymbolsMatchResult[];
}

export interface IFetchSymbolsMatchResult {
  "1. symbol": string;
  "2. name": string;
}

export interface IFetchTimeSeriesDailyResponse {
  "Time Series (Daily)": IFetchTimeSeriesDailyResult;
}

export interface IFetchTimeSeriesIntradayResponse {
  "Time Series (60min)": IFetchTimeSeriesDailyResult;
}

export type IFetchTimeSeriesDailyResult = {
  [key: string]: {
    "1. open": string;
  };
};

export type LineChartData = ChartData<"line", DefaultDataPoint<"line">, string>;
