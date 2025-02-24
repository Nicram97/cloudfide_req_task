import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeFactoryService } from '../factory/exchangeFactory.service';
import { DefaultStrategy } from '../../strategy/default.strategy';
import { IHistoricalTrade } from '../../types/historicalTrade.interface';
import { IAnalyzeResult } from '../../types/analyzeResult.interface';
import { HttpService } from '@nestjs/axios';
import { BinanceTradesHistoryDto } from '../../utils/dto/binanceTradesHistory.dto';
import * as QueryString from 'node:querystring';
import { BINANCE_HISTORY_ENDPOINT } from '../../utils/constants';

@Controller('binance')
export class BinanceController {
  constructor(
    private readonly exchangeFactoryService: ExchangeFactoryService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Used only for testing purpose as task description requires testing only call for fetching data (which without storing in some DB is just to be not much usage in this endpoint)
   * @param binanceTradesHistoryDto : BinanceTradesHistoryDto - object representing data used by Binance API to get Historical Trades data
   * @returns IHistoricalTrade[] - array of historical trades
   */
  @Post('fetchData/default')
  fetchDefaultStrategy(
    @Body() binanceTradesHistoryDto: BinanceTradesHistoryDto,
  ) {
    const exchangeUrl = `${BINANCE_HISTORY_ENDPOINT}?${QueryString.encode({ ...binanceTradesHistoryDto })}`;
    const exchangeService = this.exchangeFactoryService.get<
      IHistoricalTrade,
      IAnalyzeResult
    >('binance');
    exchangeService.setStrategy(
      new DefaultStrategy(exchangeUrl, this.httpService),
    );

    return exchangeService.getStrategy().fetchData();
  }

  @Post('analyzeFetched/default')
  analyzeFetchedDefault(
    @Body() binanceTradesHistoryDto: BinanceTradesHistoryDto,
  ) {
    const exchangeUrl = `${BINANCE_HISTORY_ENDPOINT}?${QueryString.encode({ ...binanceTradesHistoryDto })}`;
    const exchangeService = this.exchangeFactoryService.get<
      IHistoricalTrade,
      IAnalyzeResult
    >('binance');
    exchangeService.setStrategy(
      new DefaultStrategy(exchangeUrl, this.httpService),
    );

    return exchangeService.analyzeFetchedData();
  }
}
