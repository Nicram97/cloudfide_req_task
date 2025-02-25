import { Test } from '@nestjs/testing';
import { BinanceService } from '../../../../src/exchange/binance/binance.service';
import { HttpService } from '@nestjs/axios';
import { ExchangeFactoryService } from '../../../../src/exchange/factory/exchangeFactory.service';
import { IHistoricalTrade } from '../../../../src/types/historicalTrade.interface';
import { IAnalyzeResult } from '../../../../src/types/analyzeResult.interface';
import { DefaultStrategy } from '../../../../src/strategy/default.strategy';
import { BINANCE_HISTORY_ENDPOINT } from '../../../../src/utils/constants';
import * as QueryString from 'node:querystring';
import { BinanceTradesHistoryDto } from '../../../../src/utils/dto/binanceTradesHistory.dto';
import { mockHistoricalResponse } from '../../mockData/mockHistoricalResponse';

jest.mock('axios');
export const mockHttpService = {
  axiosRef: {
    get: jest.fn(),
  },
};
describe('BinanceService', () => {
  let exchangeFactoryService: ExchangeFactoryService;
  let binanceService: BinanceService<IHistoricalTrade, IAnalyzeResult>;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExchangeFactoryService,
        BinanceService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    exchangeFactoryService = moduleRef.get(ExchangeFactoryService);
    binanceService = moduleRef.get(BinanceService);
    httpService = moduleRef.get(HttpService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('set/get Strategy', () => {
    it('should set strategy as instance of DefaultStrategy', () => {
      const binanceTradesHistoryDto = {
        symbol: 'BTCUSDT',
        limit: 5,
      } as BinanceTradesHistoryDto;
      const exchangeUrl = `${BINANCE_HISTORY_ENDPOINT}?${QueryString.encode({ ...binanceTradesHistoryDto })}`;
      exchangeFactoryService
        .get<IHistoricalTrade, IAnalyzeResult>('binance')
        .setStrategy(new DefaultStrategy(exchangeUrl, httpService));

      expect(binanceService.getStrategy()).toBeInstanceOf(DefaultStrategy);
    });
  });

  describe('analyzeFetchedData', () => {
    it('should return proper analyze object', async () => {
      const binanceTradesHistoryDto = {
        symbol: 'BTCUSDT',
        limit: 5,
      } as BinanceTradesHistoryDto;
      const exchangeUrl = `${BINANCE_HISTORY_ENDPOINT}?${QueryString.encode({ ...binanceTradesHistoryDto })}`;
      exchangeFactoryService
        .get<IHistoricalTrade, IAnalyzeResult>('binance')
        .setStrategy(new DefaultStrategy(exchangeUrl, httpService));

      jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockReturnValueOnce({ data: mockHistoricalResponse });

      const expectedAnalyzeResult = {
        firstTrade: {
          a: 2143528,
          p: '87038.26000000',
          q: '0.09389000',
          f: 2200052,
          l: 2200052,
          T: 1740512330997,
          m: false,
          M: true,
        },
        lastTrade: {
          a: 2143532,
          p: '87050.16000000',
          q: '0.00616000',
          f: 2200056,
          l: 2200056,
          T: 1740512336309,
          m: false,
          M: true,
        },
        percentageChange: '0.01367215',
        absValueChange: '11.90000000',
        startTime: 1740512330997,
        endTime: 1740512336309,
      } as IAnalyzeResult;

      const fetchDataCall = jest.spyOn(DefaultStrategy.prototype, 'fetchData');
      const analyzeCall = jest.spyOn(DefaultStrategy.prototype, 'analyze');
      const result = await binanceService.analyzeFetchedData();

      expect(fetchDataCall).toHaveBeenCalled();
      expect(analyzeCall).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalyzeResult);
    });
  });
});
