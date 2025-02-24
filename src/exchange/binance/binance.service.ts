import { Injectable, Logger } from '@nestjs/common';
import { IExchangeStrategy } from '../../types/exchange.strategy.interface';

/**
 * This service represents "Context" for other strategies, depeding for example on type of strategy require it will
 * call proper endpoint with given strategy
 */
@Injectable()
export class BinanceService<T, U> {
  private readonly logger = new Logger(BinanceService.name);
  /**
   * @type {IExchangeStrategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private strategy: IExchangeStrategy<T, U>;

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: IExchangeStrategy<T, U>) {
    this.strategy = strategy;
  }

  public getStrategy() {
    return this.strategy;
  }

  public async analyzeFetchedData(): Promise<U> {
    const trades = await this.strategy.fetchData();

    const analyzeResult = await this.strategy.analyze(trades);

    return analyzeResult;
  }
}
