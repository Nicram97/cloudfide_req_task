/**
 * Interface representing data of historical trades in specific time period
 */
export interface IHistoricalTrade {
  a: number; // Aggregate tradeId
  p: string; // Price - string number
  q: string; // Quantity - string number
  f: number; // First tradeId
  l: number; // Last tradeId
  T: number; // Timestamp -> number of miliseconds
  m: boolean; // Was the buyer the maker? -> is one to buy the same person who created the trade
  M: boolean; // Was the trade the best price match? -> did fulfill whole trade at once
}
