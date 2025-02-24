import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SupportedExchange } from '../../types/supportedExchange.type';
import { BinanceService } from '../binance/binance.service';

/**
 * Factory like pattern service which returns proper exchange service depending on need dynamically
 */
@Injectable()
export class ExchangeFactoryService {
  constructor(private readonly moduleRef: ModuleRef) {}

  get<T, U>(exchangeName: SupportedExchange) {
    switch (exchangeName) {
      case 'binance': {
        return this.moduleRef.get(BinanceService<T, U>);
      }
    }
  }
}
