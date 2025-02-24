import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { ExchangeFactoryService } from '../factory/exchangeFactory.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BinanceController],
  providers: [BinanceService, ExchangeFactoryService],
  exports: [BinanceService],
})
export class BinanceModule {}
