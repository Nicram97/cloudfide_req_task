// Idea for the app is to be able to handle multiple exchanges with possibility to handle multiple strategies to upload and
// analyze the data, for example change in price strategy, percentage changes etc... whatever is required but if we need same behaviour
// for multiple exchanges following proper interface will allow it
export interface IExchangeStrategy<T, U> {
  fetchData(): Promise<Array<T>>;

  analyze(trades: T[]): U;
}
