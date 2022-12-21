export interface IFetchSymbols {
  bestMatches: IFetchSymbolsMatch[];
}

export interface IFetchSymbolsMatch {
  "1. symbol": string;
  "2. name": string;
}
