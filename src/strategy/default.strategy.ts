import { HttpService } from '@nestjs/axios';
import { IExchangeStrategy } from '../types/exchange.strategy.interface';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { IHistoricalTrade } from '../types/historicalTrade.interface';
import { IAnalyzeResult } from '../types/analyzeResult.interface';

/**
 * Class following Strategy Pattern (Behaviour) introduces possibility to systematically allow multiple ways to analyze provided trades data
 */
export class DefaultStrategy
  implements IExchangeStrategy<IHistoricalTrade, IAnalyzeResult>
{
  private readonly exchangeUrl: string;
  private readonly httpService: HttpService;

  constructor(exchangeUrl: string, httpService: HttpService) {
    this.exchangeUrl = exchangeUrl;
    this.httpService = httpService;
  }

  async fetchData<IHistoricalTrade>(): Promise<Array<IHistoricalTrade>> {
    try {
      const res = await this.httpService.axiosRef.get(this.exchangeUrl);

      return res.data as IHistoricalTrade[];
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw e;
      }
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * For task purpose lets assume simplest strategy, lets take 1st and last value and check what was the change
   * @param trades : T[] - array of elements representing trades
   */
  analyze(trades: IHistoricalTrade[]): IAnalyzeResult {
    if (trades.length >= 2) {
      const firstTr = trades[0];
      const lastTr = trades[trades.length - 1];
      const startPrice = parseFloat(firstTr.p);
      const endPrice = parseFloat(lastTr.p);

      const percentageChange = (
        ((endPrice - startPrice) / startPrice) *
        100
      ).toFixed(8);
      const absValueChange = Math.abs(endPrice - startPrice).toFixed(8);

      return {
        firstTrade: firstTr,
        lastTrade: lastTr,
        percentageChange,
        absValueChange,
        startTime: firstTr.T,
        endTime: lastTr.T,
      } as IAnalyzeResult;
    } else if (trades.length === 1) {
      const firstTr: IHistoricalTrade = trades[0];
      return {
        percentageChange: '0',
        absValueChange: '0',
        startTime: firstTr.T,
        endTime: firstTr.T,
        firstTrade: firstTr,
        lastTrade: firstTr,
      } as IAnalyzeResult;
    }
    throw new NotFoundException('No trades to analyze!');
  }
}
