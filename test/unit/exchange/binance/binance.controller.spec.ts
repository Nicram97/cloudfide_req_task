import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { BinanceController } from '../../../../src/exchange/binance/binance.controller';
import { BinanceService } from '../../../../src/exchange/binance/binance.service';
import { ExchangeFactoryService } from '../../../../src/exchange/factory/exchangeFactory.service';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
export const mockHttpService = {
  axiosRef: {
    get: jest.fn(),
  },
};

export const mockHistoricalResponse = [
  {
    a: 2143528,
    p: '87038.26000000',
    q: '0.09389000',
    f: 2200052,
    l: 2200052,
    T: 1740512330997,
    m: false,
    M: true,
  },
  {
    a: 2143529,
    p: '87038.26000000',
    q: '0.08160000',
    f: 2200053,
    l: 2200053,
    T: 1740512331011,
    m: false,
    M: true,
  },
  {
    a: 2143530,
    p: '87038.26000000',
    q: '0.11141000',
    f: 2200054,
    l: 2200054,
    T: 1740512331027,
    m: false,
    M: true,
  },
  {
    a: 2143531,
    p: '87050.16000000',
    q: '0.00200000',
    f: 2200055,
    l: 2200055,
    T: 1740512335421,
    m: false,
    M: true,
  },
  {
    a: 2143532,
    p: '87050.16000000',
    q: '0.00616000',
    f: 2200056,
    l: 2200056,
    T: 1740512336309,
    m: false,
    M: true,
  },
];

describe('BinanceController', () => {
  let binanceController: BinanceController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BinanceController],
      providers: [
        ExchangeFactoryService,
        BinanceService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    binanceController = moduleRef.get(BinanceController);
  });

  describe('fetchDefaultStrategy', () => {
    it('should return binance data', async () => {
      jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockReturnValueOnce({ data: mockHistoricalResponse });

      const result = await binanceController.fetchDefaultStrategy({
        symbol: 'BTCUSDT',
        limit: 5,
      });

      expect(result).toEqual(expect.arrayContaining(mockHistoricalResponse));
    });

    it('should return empty array', async () => {
      jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockReturnValueOnce({ data: [] });

      const result = await binanceController.fetchDefaultStrategy({
        symbol: 'BTCUSDT',
        limit: 5,
      });

      expect(result.length).toEqual(0);
    });

    it('should throw proper 404 - NotFoundException when axios error', async () => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true);
      jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockRejectedValueOnce(new NotFoundException('Data not found'));

      try {
        await binanceController.fetchDefaultStrategy({
          symbol: 'BTCUSDT',
          limit: 5,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw InternalServerErrorException no Axios error', async () => {
      const notKnownErrorMessage = 'Not known error';
      jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockRejectedValueOnce(new Error(notKnownErrorMessage));

      try {
        await binanceController.fetchDefaultStrategy({
          symbol: 'BTCUSDT',
          limit: 5,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual(notKnownErrorMessage);
      }
    });
  });
});
