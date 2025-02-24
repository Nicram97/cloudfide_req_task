import { IHistoricalTrade } from './historicalTrade.interface';

/**
 * Analyze should follow proper result schema - object with such structure will be returned after analyze
 */
export interface IAnalyzeResult {
  firstTrade: IHistoricalTrade; // kept just to check if API request
  lastTrade: IHistoricalTrade; // kept just to check if API request
  percentageChange: string; // string representing percentage change of the value
  absValueChange: string; // number string representing absolute value change
  startTime: number; // from which point in time analyze started
  endTime: number; // on which point in time analyze ended
}
