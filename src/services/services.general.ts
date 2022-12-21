import { IFetchSymbols, IFetchSymbolsMatch } from "../types/general.types";

export const fetchSymbols = (keyword: string): Promise<IFetchSymbolsMatch[]> =>
  fetch(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${import.meta.env.ALPHAVANTAGE_API_KEY}`
  )
    .then((res) => res.json())
    .then((res: IFetchSymbols) => res.bestMatches);

export const fetchTimeSeries = (symbol: string) => {
  const key = `time-series-${symbol}`;
  const cache = localStorage.getItem(key);

  if (cache) {
    return Promise.resolve(JSON.parse(cache));
  }

  return fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${import.meta.env.ALPHAVANTAGE_API_KEY}`
  )
    .then((res) => res.json())
    .then((res) => res["Time Series (Daily)"])
    .then((res) => {
      localStorage.setItem(key, JSON.stringify(res));
      return res;
    });
};
