import {
  IFetchSymbolsResponse,
  IFetchSymbolsMatchResult,
  IFetchTimeSeriesDailyResult,
  IFetchTimeSeriesDailyResponse,
  IFetchTimeSeriesIntradayResponse,
} from "../types/general.types";
import { fetchWithSteroids } from "../utils/fetchWithSteroids";

export const fetchSymbols = (
  keyword: string
): Promise<IFetchSymbolsMatchResult[]> => {
  const key = `search-${keyword}`;
  return fetchWithSteroids<IFetchSymbolsResponse>(key)(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${
      import.meta.env.ALPHAVANTAGE_API_KEY
    }`
  ).then((res) => res.bestMatches);
};

export const fetchTimeSeriesDaily = (
  symbol: string
): Promise<IFetchTimeSeriesDailyResult> => {
  const key = `time-series-daily-${symbol}`;
  return fetchWithSteroids<IFetchTimeSeriesDailyResponse>(key)(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${
      import.meta.env.ALPHAVANTAGE_API_KEY
    }&outputsize=full`
  ).then((res) => res["Time Series (Daily)"]);
};

export const fetchTimeSeriesIntraday = (
  symbol: string
): Promise<IFetchTimeSeriesDailyResult> => {
  const key = `time-series-intraday-${symbol}`;
  return fetchWithSteroids<IFetchTimeSeriesIntradayResponse>(key)(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=60min&symbol=${symbol}&apikey=${
      import.meta.env.ALPHAVANTAGE_API_KEY
    }`
  ).then((res) => res["Time Series (60min)"]);
};
