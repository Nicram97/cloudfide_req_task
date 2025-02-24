import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * Object representing data required or optional to fetch Binance historical trades
 */
export class BinanceTradesHistoryDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fromId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  startTime?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  endTime?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit = 500;
}
