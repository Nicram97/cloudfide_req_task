import { Module } from '@nestjs/common';
import { BinanceModule } from './binance/binance.module';

// module to contain possible multiple exchanges modules
@Module({
  imports: [BinanceModule],
})
export class ExchangeModule {}
