/**
 * Created by Tobias on 12.02.2017.
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TransactionService} from '../transaction.service';
@Injectable()
export class UserTransactionStore {

  private state;
  public state$;

  constructor(public transactionService: TransactionService) {
    this.state = {
      offset: 0,
      overallCount: 0,
      limit: 10,
      entries: [],
      page:0,
      maxPage:0
    };

    this.state$ = new BehaviorSubject(this.state);
  }

  getUserTransactions(userId, limit, offset) {
    return this.transactionService.getTransactions(userId, limit, offset).toPromise().then(res => {
      res.page = UserTransactionStore.getCurrentPage(res.limit, res.offset);
      res.maxPage = UserTransactionStore.getMaxPage(res.limit, res.overallCount) || 1;

      const newState = Object.assign(this.state, res);
      this.state$.next(newState);
    });
  }

  static getCurrentPage(limit, offset) {
    return Math.round(offset / limit) + 1;
  }

  static getMaxPage(limit, overallCount) {
    return Math.round(overallCount / limit);
  }
}
