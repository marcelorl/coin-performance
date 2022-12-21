import { IFetchSymbols, IFetchSymbolsMatch } from "../types/general.types";
import { fetchWithSteroids } from "../utils/fetchWithSteroids";

export const fetchSymbols = (
  keyword: string
): Promise<IFetchSymbolsMatch[]> => {
  const key = `search-${keyword}`;
  return fetchWithSteroids(key)(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${
      import.meta.env.ALPHAVANTAGE_API_KEY
    }`
  ).then((res: IFetchSymbols) => {
    console.log("======>", res);
    return res.bestMatches;
  });
};

export const fetchTimeSeries = (symbol: string) => {
  const key = `time-series-${symbol}`;
  return fetchWithSteroids(key)(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${
      import.meta.env.ALPHAVANTAGE_API_KEY
    }&outputsize=full`
  ).then((res: any) => res["Time Series (Daily)"]);
};
